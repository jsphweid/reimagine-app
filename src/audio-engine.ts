import { getSecondsPerBeat, midiToFreq } from "./common/helpers";
import WavEncoder from "./encoders/wav-encoder";
import { waitUntil } from "./utils";
import { click } from "./click";
import { Note } from "./generated";
export interface AudioSessionConfig {
  playMetronome?: boolean;
  playNotes?: boolean;
  startTime: number;
  notes: Note[];
  recordingDate?: string;
  bpm: number;
}

class AudioEngine {
  public static instance: AudioEngine;
  public audioContext: AudioContext;
  private bufferSources: AudioBufferSourceNode[] = [];
  private source?: MediaStreamAudioSourceNode;
  private processor?: ScriptProcessorNode;
  private wavEncoder: WavEncoder;
  private activeAudioElement: HTMLAudioElement | null = null;
  private gain?: GainNode;

  constructor() {
    // enforce singleton
    if (!AudioEngine.instance) {
      AudioEngine.instance = this;
    }

    this.audioContext = new ((<any>window).AudioContext ||
      (<any>window).webkitAudioContext)();

    this.gain = this.audioContext.createGain();

    this.wavEncoder = new WavEncoder(this.audioContext.sampleRate, 1);

    return AudioEngine.instance;
  }

  private scheduleBuffer(buffer: AudioBuffer, time: number) {
    const source = this.audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(this.gain!);
    this.gain!.connect(this.audioContext.destination);
    source.start(time);
    this.bufferSources.push(source);
  }

  private scheduleNote(
    offset: number,
    time: number,
    duration: number,
    frequency: number
  ): void {
    const buffer = this.createBuffer(duration, frequency);
    this.scheduleBuffer(buffer, time + offset);
  }

  private scheduleMetronomeClicks(startTime: number, bpm: number): void {
    // TODO: the number of beats should be known
    const numberOfMetronomeBeats = 40;
    const secondsPerBeat = getSecondsPerBeat(bpm);
    for (let i = 0; i < numberOfMetronomeBeats; i++) {
      const buffer = this.createMetronomeBuffer();
      this.scheduleBuffer(buffer, startTime + i * secondsPerBeat);
    }
  }

  private createMetronomeBuffer(): AudioBuffer {
    // NOTE: if different sample rate, for now it doesn't adjust
    const buffer = this.audioContext.createBuffer(
      1,
      click.length,
      this.audioContext.sampleRate
    );

    for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
      const nowBuffering = buffer.getChannelData(channel);
      for (let i = 0; i < buffer.length; i++) {
        nowBuffering[i] = click[i];
      }
    }

    return buffer;
  }

  private createBuffer(duration: number, frequency: number): AudioBuffer {
    const sampleRate = this.audioContext.sampleRate;
    const buffer = this.audioContext.createBuffer(
      1,
      duration * sampleRate,
      sampleRate
    );

    const angularFrequency = frequency * 2 * Math.PI;

    for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
      const nowBuffering = buffer.getChannelData(channel);
      for (let i = 0; i < buffer.length; i++) {
        nowBuffering[i] = Math.sin(
          (i / this.audioContext.sampleRate) * angularFrequency
        );
      }

      // taper off end so no click
      if (buffer.length > 1000) {
        for (let i = 1000; i >= 0; i--) {
          const j = buffer.length - i;
          nowBuffering[j] = nowBuffering[j] * (i / 1000);
        }
      }
    }

    return buffer;
  }

  private scheduleNotes(startTime: number, notes: Note[]): void {
    notes.forEach((note) => {
      this.scheduleNote(
        startTime,
        note.time,
        note.duration,
        midiToFreq(note.midi)
      );
    });
  }

  private scheduleSynthNotes(config: AudioSessionConfig) {
    const { playMetronome, playNotes, startTime } = config;

    const { notes, bpm } = config;

    if (playMetronome) {
      this.scheduleMetronomeClicks(config.startTime, bpm);
    }

    if (playNotes) {
      this.scheduleNotes(startTime, notes);
    }
  }

  private turnOnGain() {
    if (this.gain) {
      this.gain.gain.setValueAtTime(1, this.audioContext.currentTime);
    }
  }

  public startPlayingNotes(config: AudioSessionConfig): void {
    this.turnOnGain();
    this.scheduleSynthNotes(config);
  }

  public startRecording(config: AudioSessionConfig): void {
    this.turnOnGain();
    this.connectRecordingNodes();
    this.scheduleSynthNotes(config);
  }

  private connectRecordingNodes(): void {
    this.wavEncoder = new WavEncoder(this.audioContext.sampleRate, 1);
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      this.source = this.audioContext.createMediaStreamSource(stream);
      this.processor = this.audioContext.createScriptProcessor(1024, 1, 1);
      this.processor.onaudioprocess = (event: AudioProcessingEvent) => {
        if (this.wavEncoder) {
          this.wavEncoder.encode([event.inputBuffer.getChannelData(0)]);
        } else {
          console.error("wavEncoder instance doesn't exist on AudioEngine");
        }
      };
      this.source.connect(this.processor);
      this.processor.connect(this.audioContext.destination);
    });
  }

  private shutoff() {
    const rampDownMillis = 30;
    const originalGain = this.gain?.gain.value || 1;
    if (this.gain) {
      // In theory this works but we still get a click...
      this.gain.gain.exponentialRampToValueAtTime(
        0.0001,
        this.audioContext.currentTime + rampDownMillis / 1000
      );
    }

    setTimeout(() => {
      this.bufferSources.forEach((source) => source.disconnect());
      this.bufferSources = [];

      if (this.gain) {
        // disconnect but reset gain value so it's ready for next time
        this.gain.gain.setValueAtTime(
          originalGain,
          this.audioContext.currentTime
        );
        this.gain.disconnect();
      }
      if (this.source) this.source.disconnect();
      if (this.processor) this.processor.disconnect();
    }, rampDownMillis);
  }

  public stopRecording(): Blob {
    this.shutoff();
    // TODO: click may be coming from this...
    const blob: Blob = this.wavEncoder.finish();
    this.wavEncoder = new WavEncoder(this.audioContext.sampleRate, 1);
    return blob;
  }

  public stopPlayingRecording() {
    this.shutoff();
    if (this.activeAudioElement) {
      this.activeAudioElement.pause();
      this.activeAudioElement = null;
    }
  }

  public async startPlayingUrl(url: string, onStop?: Function) {
    this.activeAudioElement = new Audio(url);
    this.activeAudioElement.play();
    this.activeAudioElement.onended = onStop as any;
    return this.activeAudioElement;
  }
}

export const getAudioEngine = async () => {
  const audioEngine = new AudioEngine();
  if (audioEngine.audioContext.state !== "running") {
    await audioEngine.audioContext.resume();
  }

  // Even after we resume the engine, we still need to
  // wait for the currentTime to be a non-zero value
  await waitUntil(() => !!audioEngine.audioContext.currentTime);
  return audioEngine;
};

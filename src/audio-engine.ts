import { Note } from "midiconvert";
import { Midi } from "@tonejs/midi";

import { getSecondsPerBeat, midiToFreq } from "./common/helpers";
import WavEncoder from "./encoders/wav-encoder";

export interface AudioSessionConfig {
  playMetronome?: boolean;
  playNotes?: boolean;
  startTime: number;
  midi?: Midi;
  recordingDate?: string;
}

class AudioEngine {
  public static instance: AudioEngine;
  public audioContext: AudioContext;
  private oscillators: OscillatorNode[] = [];
  private source?: MediaStreamAudioSourceNode;
  private processor?: ScriptProcessorNode;
  private wavEncoder: WavEncoder | null = null;

  constructor() {
    // enforce singleton
    if (!AudioEngine.instance) {
      AudioEngine.instance = this;
    }

    this.audioContext = new ((<any>window).AudioContext ||
      (<any>window).webkitAudioContext)();

    return AudioEngine.instance;
  }

  private scheduleSoundEvent(
    offset: number,
    time: number,
    duration: number,
    frequency: number
  ): void {
    const osc = this.audioContext.createOscillator();
    osc.connect(this.audioContext.destination);
    osc.frequency.value = frequency;
    const adjustedTime = time + offset;
    osc.start(adjustedTime);
    osc.stop(adjustedTime + duration - 0.05);
    this.oscillators.push(osc);
  }

  private scheduleMetronomeClicks(startTime: number, bpm: number): void {
    const numberOfMetronomeBeats = 40;
    const secondsPerBeat = getSecondsPerBeat(bpm);
    for (let i = 0; i < numberOfMetronomeBeats; i++) {
      this.scheduleSoundEvent(startTime, i * secondsPerBeat, 0.15, 440);
    }
  }

  private scheduleNotes(startTime: number, notes: Note[]): void {
    notes.forEach((note) => {
      this.scheduleSoundEvent(
        startTime,
        note.time,
        note.duration,
        midiToFreq(note.midi)
      );
    });
  }

  private scheduleSynthNotes(config: AudioSessionConfig) {
    const { playMetronome, playNotes, startTime } = config;

    // TODO: temporary
    if (!config.midi) {
      throw new Error(
        "We are playing but expectedd synth notes... no midi on plays..."
      );
    }

    const notes = config.midi.tracks[0].notes;
    // NOTE: for now we assume there is only 1 bpm for the project...
    const bpm = config.midi.header.tempos[0].bpm;

    if (playMetronome) {
      this.scheduleMetronomeClicks(config.startTime, bpm);
    }

    if (playNotes) {
      this.scheduleNotes(startTime, notes);
    }
  }

  public startPlaying(config: AudioSessionConfig): void {
    this.scheduleSynthNotes(config);
  }

  public startRecording(config: AudioSessionConfig): void {
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

  private shutOffOscillatorsAndDisconnectRecordingNodes() {
    this.oscillators.forEach((osc) => osc.disconnect());
    this.oscillators = [];
    if (this.source) this.source.disconnect();
    if (this.processor) this.processor.disconnect();
  }

  public stopRecording(getBlob: boolean = false): Blob | null {
    this.shutOffOscillatorsAndDisconnectRecordingNodes();
    if (getBlob && this.wavEncoder) {
      const blob: Blob = this.wavEncoder.finish();
      this.wavEncoder = null;
      return blob;
    }
    return null;
  }
}

export default AudioEngine;

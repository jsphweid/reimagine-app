import { getSecondsPerBeat, midiToFreq } from './common/helpers'
import { Note } from 'midiconvert'
import WavEncoder from './encoders/wav-encoder'
import { RecordingSessionConfigType } from './common/types'

class AudioEngine {
	public static instance: AudioEngine
	public audioContext: AudioContext
	private oscillators: OscillatorNode[] = []
	private source: MediaStreamAudioSourceNode
	private processor: ScriptProcessorNode
	private wavEncoder: WavEncoder

	constructor() {
		if (!AudioEngine.instance) {
			AudioEngine.instance = this
			this.audioContext = new AudioContext()
		}

		return AudioEngine.instance
	}

	private scheduleSoundEvent(offset: number, time: number, duration: number, frequency: number): void {
		const osc = this.audioContext.createOscillator()
		osc.connect(this.audioContext.destination)
		osc.frequency.value = frequency
		const adjustedTime = time + offset
		osc.start(adjustedTime)
		osc.stop(adjustedTime + duration - 0.05)
		this.oscillators.push(osc)
	}

	private scheduleMetronomeClicks(startTime: number, bpm: number): void {
		const numberOfMetronomeBeats = 40
		const secondsPerBeat = getSecondsPerBeat(bpm)
		for (let i = 0; i < numberOfMetronomeBeats; i++) {
			this.scheduleSoundEvent(startTime, i * secondsPerBeat, 0.15, 440)
		}
	}

	private scheduleNotes(startTime: number, notes: Note[]): void {
		notes.forEach(note => {
			this.scheduleSoundEvent(startTime, note.time, note.duration, midiToFreq(note.midi))
		})
	}

	public startRecording(config: RecordingSessionConfigType): void {
		const { isMockRecording, playMetronome, playNotes, segment, startTime } = config
		if (!isMockRecording) this.connectRecordingNodes()
		if (playMetronome) this.scheduleMetronomeClicks(config.startTime, segment.midiJson.header.bpm)
		if (playNotes) this.scheduleNotes(startTime, segment.midiJson.tracks[0].notes)
	}

	private connectRecordingNodes(): void {
		this.wavEncoder = new WavEncoder(44100, 1)
		navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
			this.source = this.audioContext.createMediaStreamSource(stream)
			console.log('---------', this.source)
			this.processor = this.audioContext.createScriptProcessor(1024, 1, 1)
			this.processor.onaudioprocess = (event: AudioProcessingEvent) => {
				this.wavEncoder.encode([event.inputBuffer.getChannelData(0)])
			}
			this.source.connect(this.processor)
			this.processor.connect(this.audioContext.destination)
		})
	}

	public playBlob(blobUrl: string): void {
		new Audio(blobUrl).play()

		// const audioBufferNode: AudioBufferSourceNode = this.audioContext.createBufferSource()
		// const gainNode = this.audioContext.createGain()
		// audioBufferNode.buffer = buffer
		// audioBufferNode.start(0)
		// gainNode.gain.value = 0.5
		// audioBufferNode.connect(gainNode)
		// gainNode.connect(this.audioContext.destination)
	}

	private shutOffOscillators() {
		this.oscillators.forEach(osc => osc.disconnect())
		this.oscillators = []
	}

	private disconnectRecordingNodes() {
		if (this.source) this.source.disconnect()
		if (this.processor) this.processor.disconnect()
	}

	public stopRecording(getBlob: boolean): Blob {
		this.shutOffOscillators()
		this.disconnectRecordingNodes()
		if (getBlob && this.wavEncoder) {
			const blob: Blob = this.wavEncoder.finish()
			this.wavEncoder = null
			return blob
		}
		return null
	}
}

const instance: AudioEngine = new AudioEngine()

export default instance

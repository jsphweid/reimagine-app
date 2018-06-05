import * as React from 'react'
import MidiVisualizer from 'react-midi-visualizer'
import Metronome from 'react-conductor'
import { Note } from 'midiconvert'
import { SegmentType } from '../../utils/types'
import { midiToFreq, getSecondsPerBeat } from '../../utils/helpers'

export interface InteractiveComponentProps {
	segment: SegmentType
}

export interface InteractiveComponentState {
	startTime: number
	isRecording: boolean
	audioContextOccupied: boolean
	playMetronome: boolean
}

export default class InteractiveComponent extends React.Component<
	InteractiveComponentProps,
	InteractiveComponentState
> {
	audioContext: AudioContext = null
	allOscs: OscillatorNode[] = []

	constructor(props: InteractiveComponentProps) {
		super(props)
		this.state = {
			startTime: null,
			isRecording: false,
			audioContextOccupied: false,
			playMetronome: false
		}
	}

	componentDidMount() {
		this.audioContext = new AudioContext()
	}

	componentWillUnmount() {
		this.handleStopRecording()
	}

	private renderMidiVisualizer(notes: Note[]): JSX.Element {
		return notes ? (
			<MidiVisualizer
				audioContext={this.audioContext}
				height={500}
				width={800}
				startTime={this.state.startTime}
				notes={notes}
			/>
		) : null
	}

	private renderMetronome(bpm: number): JSX.Element {
		return (
			<Metronome
				audioContext={this.audioContext}
				width={200}
				height={200}
				bpm={bpm}
				startTime={this.state.startTime}
				options={{}}
			/>
		)
	}

	private scheduleSoundEvent(timeOffset: number, time: number, duration: number, frequency: number): void {
		const osc = this.audioContext.createOscillator()
		osc.connect(this.audioContext.destination)
		osc.frequency.value = frequency
		const adjustedTime = time + timeOffset
		osc.start(adjustedTime)
		osc.stop(adjustedTime + duration - 0.05)
		this.allOscs.push(osc)
	}

	private scheduleSounds(timeOffset: number, playNotes: boolean) {
		const { midiJson } = this.props.segment
		if (playNotes) {
			midiJson.tracks[0].notes.forEach(note => {
				this.scheduleSoundEvent(timeOffset, note.time, note.duration, midiToFreq(note.midi))
			})
		}
		if (this.state.playMetronome) {
			const numberOfMetronomeBeats = 40
			const secondsPerBeat = getSecondsPerBeat(midiJson.header.bpm)
			for (let i = 0; i < numberOfMetronomeBeats; i++) {
				this.scheduleSoundEvent(timeOffset, i * secondsPerBeat, 0.15, 440)
			}
		}
	}

	private handleStartRecording(dryRun: boolean = false): void {
		const startTime = this.audioContext.currentTime
		this.scheduleSounds(startTime, dryRun)
		this.setState({ startTime, isRecording: !dryRun, audioContextOccupied: true })
	}

	private handleStopRecording(): void {
		this.shutOffOscillators()
		this.setState({ isRecording: false, startTime: null, audioContextOccupied: false })
	}

	private shutOffOscillators() {
		this.allOscs.forEach(osc => osc.disconnect())
	}

	private renderStartStopButton(): JSX.Element {
		const { audioContextOccupied } = this.state
		const buttonText = audioContextOccupied ? 'STOP' : 'RECORD'
		const clickHandler = audioContextOccupied ? this.handleStopRecording : this.handleStartRecording
		return <button onClick={clickHandler.bind(this, false)}>{buttonText}</button>
	}

	private renderPlayThroughButton(): JSX.Element {
		return this.state.audioContextOccupied ? null : (
			<button onClick={this.handleStartRecording.bind(this, true)}>Play Through</button>
		)
	}

	private renderMetronomeCheckbox(): JSX.Element {
		return (
			<div>
				<input
					type="checkbox"
					checked={this.state.playMetronome}
					onChange={() => this.setState({ playMetronome: !this.state.playMetronome })}
				/>
				Play Metronome
			</div>
		)
	}

	render() {
		const { midiJson } = this.props.segment
		return (
			<div className="reimagine-interactiveComponent">
				<div>
					{this.renderMetronomeCheckbox()}
					{this.renderPlayThroughButton()}
					{this.renderStartStopButton()}
					{this.renderMidiVisualizer(midiJson.tracks[0].notes)}
					{this.renderMetronome(midiJson.header.bpm)}
					{this.state.isRecording ? 'recording for real...' : null}
				</div>
			</div>
		)
	}
}

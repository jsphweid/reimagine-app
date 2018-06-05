import * as React from 'react'
import MidiVisualizer from 'react-midi-visualizer'
import Metronome from 'react-conductor'
import { Note } from 'midiconvert'
import { getSegment } from '../connectors/redux/actions/graphql'
import { withSiteData } from 'react-static'
import { connect } from 'react-redux'
import { SegmentType } from '../utils/types'
import { midiToFreq, getSecondsPerBeat } from '../utils/helpers'
import { INPUT_OBJECT_TYPE_DEFINITION } from 'graphql/language/kinds'

export interface MainProps {
	dispatch: any
	activeSegment: SegmentType
	segmentLoading: boolean
}

export interface MainState {
	startTime: number
	reactResetKey: string
	isRecording: boolean
	audioContextOccupied: boolean
	playMetronome: boolean
}

export class Main extends React.Component<MainProps, MainState> {
	audioContext: AudioContext = null
	allOscs: OscillatorNode[] = []

	constructor(props: MainProps) {
		super(props)
		this.state = {
			startTime: null,
			reactResetKey: 'firstKey',
			isRecording: false,
			audioContextOccupied: false,
			playMetronome: false
		}
	}

	componentDidMount() {
		document.title = 're:Imagine'
		this.audioContext = new AudioContext()
	}

	private renderMidiVisualizer(notes: Note[]): JSX.Element {
		return notes ? (
			<MidiVisualizer
				key={`MidiVisualizer${this.state.reactResetKey}`}
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
		const { midiJson } = this.props.activeSegment
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

	private handleNewSegment(): void {
		const randomHash: string = Math.random()
			.toString(36)
			.substring(7)
		this.setState({ reactResetKey: randomHash })
		this.handleStopRecording()
		this.props.dispatch(getSegment())
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

	private renderInteractivePart(): JSX.Element {
		const { segmentLoading, activeSegment } = this.props
		switch (true) {
			default:
			case !segmentLoading && !activeSegment:
				return <div>Fetch a segment and let's get started.</div>
			case segmentLoading:
				return <div>LOADING!!</div>
			case !!activeSegment:
				const { midiJson } = this.props.activeSegment
				// whats the next thing to do...?
				// implement sounds...
				return (
					<div>
						{this.renderMetronomeCheckbox()}
						{this.renderPlayThroughButton()}
						{this.renderStartStopButton()}
						{this.renderMidiVisualizer(midiJson.tracks[0].notes)}
						{this.renderMetronome(midiJson.header.bpm)}
						{this.state.isRecording ? 'recording for real...' : null}
					</div>
				)
		}
	}

	render() {
		return (
			<div className="reimagine">
				<button onClick={this.handleNewSegment.bind(this)}>Fetch Segment</button>
				{this.renderInteractivePart()}
			</div>
		)
	}
}

const mapStateToProps = (store: any, ownProp?: any): MainProps => ({
	dispatch: ownProp.dispatch,
	activeSegment: store.graphql.activeSegment,
	segmentLoading: store.graphql.segmentLoading
})

export default withSiteData(connect(mapStateToProps)(Main))

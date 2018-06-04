import * as React from 'react'
import gql from 'graphql-tag'
import { Query } from 'react-apollo'
import MidiVisualizer from 'react-midi-visualizer'
import Metronome from 'react-conductor'
import { Note, MIDI } from 'midiconvert'

export interface MainProps {}

export interface MainState {
	startTime: number
	reactResetKey: string
	isRecording: boolean
}

const myQuery = gql`
	{
		segment {
			id
			date
			midiJson
			difficulty
			pieceId
			offsetTime
		}
	}
`

export default class Main extends React.Component<MainProps, MainState> {
	audioContext: AudioContext

	constructor(props: MainProps) {
		super(props)
		this.state = {
			startTime: null,
			reactResetKey: 'firstKey',
			isRecording: false
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

	private handleStartRecording(): void {
		this.setState({ isRecording: true, startTime: this.audioContext.currentTime })
	}

	private handleStopRecording(): void {
		this.setState({ isRecording: false, startTime: null })
	}

	private renderStartStopButton(): JSX.Element {
		const { isRecording } = this.state
		const buttonText = isRecording ? 'STOP' : 'START!'
		const clickHandler = isRecording ? this.handleStopRecording : this.handleStartRecording
		return <button onClick={clickHandler.bind(this)}>{buttonText}</button>
	}

	private handleNewSegment(refetch: Function): void {
		const randomHash: string = Math.random()
			.toString(36)
			.substring(7)
		this.setState({ reactResetKey: randomHash })
		this.handleStopRecording()
		refetch()
	}

	render() {
		return (
			<div className="reimagine">
				<Query query={myQuery}>
					{({ loading, error, data, refetch }) => {
						if (loading) return 'Loading...'
						if (error) return `Error! ${error.message}`
						const midiJson = JSON.parse(data.segment.midiJson) as MIDI
						const bpm = midiJson.header.bpm
						const notes = midiJson.tracks[0].notes

						return (
							<div>
								<div>{this.renderMidiVisualizer(notes)}</div>
								<div>
									{this.renderStartStopButton()}
									<button onClick={this.handleNewSegment.bind(this, refetch)}>New Segment</button>
									{this.renderMetronome(bpm)}
								</div>
							</div>
						)
					}}
				</Query>
			</div>
		)
	}
}

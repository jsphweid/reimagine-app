import * as React from 'react'
import MidiVisualizer from 'react-midi-visualizer'
import Metronome from 'react-conductor'
import { Note } from 'midiconvert'
import { SegmentType, RecordingSessionConfigType } from '../../utils/types'
import { connect } from 'react-redux'
import { withSiteData } from 'react-static'
import { StoreType } from '../../connectors/redux/reducers'
import AudioEngine from '../../audio-engine'
import { startRecording, stopRecording } from '../../connectors/redux/actions/audio'
import { addRecordingToStore } from '../../connectors/redux/actions/recording'

export interface InteractiveComponentProps {
	segment: SegmentType
	dispatch: any
	startTime: number
	isRecording: boolean
}

export interface InteractiveComponentState {
	playMetronome: boolean
	recordingLinks: any[]
	playNotes: boolean
}

export class InteractiveComponent extends React.Component<InteractiveComponentProps, InteractiveComponentState> {
	constructor(props: InteractiveComponentProps) {
		super(props)
		this.state = {
			playNotes: false,
			playMetronome: false,
			recordingLinks: []
		}
	}

	private renderMidiVisualizer(notes: Note[]): JSX.Element {
		return notes ? (
			<MidiVisualizer
				audioContext={AudioEngine.audioContext}
				height={500}
				width={800}
				startTime={this.props.startTime}
				notes={notes}
			/>
		) : null
	}

	private renderMetronome(bpm: number): JSX.Element {
		return (
			<Metronome
				audioContext={AudioEngine.audioContext}
				width={200}
				height={200}
				bpm={bpm}
				startTime={this.props.startTime}
				options={{}}
			/>
		)
	}

	private handleStop(): void {
		this.props.dispatch(stopRecording())
		const blob = AudioEngine.stopRecording(this.props.isRecording)
		if (blob) {
			this.props.dispatch(
				addRecordingToStore({
					blob,
					segment: this.props.segment,
					recordingDate: new Date(),
					startTime: this.props.startTime
				})
			)
		}
	}

	private renderStopButton(): JSX.Element {
		return <button onClick={this.handleStop.bind(this)}>STOP</button>
	}

	private handleStartRecording(recordingSessionConfig: RecordingSessionConfigType) {
		AudioEngine.startRecording(recordingSessionConfig)
		this.props.dispatch(startRecording(recordingSessionConfig.startTime))
	}

	private getRecordingSessionConfig(isMockRecording: boolean): RecordingSessionConfigType {
		return {
			isMockRecording,
			startTime: AudioEngine.audioContext.currentTime,
			segment: this.props.segment,
			playMetronome: this.state.playMetronome,
			playNotes: this.state.playNotes
		}
	}

	private renderStartButton(): JSX.Element {
		const recordingSessionConfig = this.getRecordingSessionConfig(false)
		return <button onClick={() => this.handleStartRecording(recordingSessionConfig)}>RECORD</button>
	}

	private renderMockRecordingButton(): JSX.Element {
		const recordingSessionConfig = this.getRecordingSessionConfig(true)
		return <button onClick={() => this.handleStartRecording(recordingSessionConfig)}>Play Through</button>
	}

	private renderPossibleBlobs(): JSX.Element {
		const { recordingLinks } = this.state
		return recordingLinks && recordingLinks.length ? (
			<div>
				{recordingLinks.map(link => (
					<a href={link} key={link}>
						{link}
					</a>
				))}
			</div>
		) : null
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
		const { segment, isRecording } = this.props
		const startStopButton = isRecording ? this.renderStopButton() : this.renderStartButton()
		const mockRecordButton = isRecording ? null : this.renderMockRecordingButton()
		return (
			<div className="reimagine-interactiveComponent">
				<div>
					{this.renderPossibleBlobs()}
					{this.renderMetronomeCheckbox()}
					{mockRecordButton}
					{startStopButton}
					{this.renderMidiVisualizer(segment.midiJson.tracks[0].notes)}
					{this.renderMetronome(segment.midiJson.header.bpm)}
					{this.props.isRecording ? 'recording for real...' : null}
				</div>
			</div>
		)
	}
}

const mapStateToProps = (store: StoreType, ownProp?: any): InteractiveComponentProps => ({
	dispatch: ownProp.dispatch,
	segment: ownProp.segment,
	startTime: store.audio.startTime,
	isRecording: !!store.audio.startTime
})

export default withSiteData(connect(mapStateToProps)(InteractiveComponent))

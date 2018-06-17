import * as React from 'react'
import MidiVisualizer from 'react-midi-visualizer'
import { Note } from 'midiconvert'
import { SegmentType, RecordingSessionConfigType } from '../../common/types'
import { connect } from 'react-redux'
import { withSiteData } from 'react-static'
import { StoreType } from '../../connectors/redux/reducers'
import AudioEngine from '../../audio-engine'
import { startRecording, stopRecording } from '../../connectors/redux/actions/audio'
import { addRecordingToStore } from '../../connectors/redux/actions/recording'
import { getRandomString } from '../../common/helpers'
import Recordings from '../recordings/recordings'
import { getSegmentFromGraphql } from '../../connectors/redux/actions/segment'

export interface InteractiveComponentProps {
	dispatch: any
	startTime: number
	isRecording: boolean
	activeSegment: SegmentType
	segmentLoading: boolean
}

export interface InteractiveComponentState {
	playMetronome: boolean
	recordingLinks: any[]
	playNotes: boolean
	randomResetKey: string
	reactResetKey: string
}

export class InteractiveComponent extends React.Component<InteractiveComponentProps, InteractiveComponentState> {
	constructor(props: InteractiveComponentProps) {
		super(props)
		this.state = {
			playNotes: false,
			playMetronome: false,
			recordingLinks: [],
			randomResetKey: '',
			reactResetKey: ''
		}
	}

	public componentWillMount() {
		if (!this.props.activeSegment) {
			this.props.dispatch(getSegmentFromGraphql())
		}
	}

	private renderMidiVisualizer(notes: Note[]): JSX.Element {
		return notes ? (
			<MidiVisualizer
				key={`visualizer-${this.state.randomResetKey}`}
				audioContext={AudioEngine.audioContext}
				height={500}
				width={800}
				startTime={this.props.startTime}
				notes={notes}
			/>
		) : null
	}

	private handleStop(): void {
		this.props.dispatch(stopRecording())
		const blob = AudioEngine.stopRecording(this.props.isRecording)
		if (blob) {
			this.props.dispatch(
				addRecordingToStore({
					blob,
					segment: this.props.activeSegment,
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
		this.setState({ randomResetKey: getRandomString() })
		this.props.dispatch(startRecording(recordingSessionConfig.startTime))
	}

	private getRecordingSessionConfig(isMockRecording: boolean): RecordingSessionConfigType {
		const startTime = AudioEngine.audioContext.currentTime
		return {
			isMockRecording,
			startTime,
			segment: this.props.activeSegment,
			playMetronome: this.state.playMetronome,
			playNotes: this.state.playNotes
		}
	}

	private renderStartButton(): JSX.Element {
		return <button onClick={() => this.handleStartRecording(this.getRecordingSessionConfig(false))}>RECORD</button>
	}

	private renderMockRecordingButton(): JSX.Element {
		return (
			<button onClick={() => this.handleStartRecording(this.getRecordingSessionConfig(true))}>
				Play Through
			</button>
		)
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

	private handleNewSegment(): void {
		this.setState({
			reactResetKey: Math.random()
				.toString(36)
				.substring(7)
		})
		this.props.dispatch(getSegmentFromGraphql())
	}

	private renderPlayNotesCheckbox(): JSX.Element {
		return (
			<div>
				<input
					type="checkbox"
					checked={this.state.playNotes}
					onChange={() => this.setState({ playNotes: !this.state.playNotes })}
				/>
				Play Notes
			</div>
		)
	}

	render() {
		const { activeSegment, isRecording, segmentLoading } = this.props
		if (segmentLoading) return <div>LOADING!!</div>
		if (!activeSegment) return null
		const startStopButton = isRecording ? this.renderStopButton() : this.renderStartButton()
		const mockRecordButton = isRecording ? null : this.renderMockRecordingButton()

		return (
			<div className="reimagine-interactiveComponent">
				<div>
					<button onClick={this.handleNewSegment.bind(this)}>Fetch Segment</button>
					<Recordings />

					{this.renderPossibleBlobs()}
					{this.renderMetronomeCheckbox()}
					{this.renderPlayNotesCheckbox()}
					{mockRecordButton}
					{startStopButton}
					{this.renderMidiVisualizer(activeSegment.midiJson.tracks[0].notes)}
					{this.props.isRecording ? 'recording for real...' : null}
				</div>
			</div>
		)
	}
}

const mapStateToProps = (store: StoreType, ownProp?: any): InteractiveComponentProps => ({
	dispatch: ownProp.dispatch,
	startTime: store.audio.startTime,
	isRecording: !!store.audio.startTime,
	activeSegment: store.segment.activeSegment,
	segmentLoading: store.segment.segmentLoading
})

export default withSiteData(connect(mapStateToProps)(InteractiveComponent))

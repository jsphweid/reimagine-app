import * as React from 'react'
import MidiVisualizer from 'react-midi-visualizer'
import { SegmentType, RecordingSessionConfigType, RecordingType } from '../../common/types'
import { connect } from 'react-redux'
import { withSiteData } from 'react-static'
import { StoreType } from '../../connectors/redux/reducers'
import AudioEngine from '../../audio-engine'
import { startRecording, stopRecording } from '../../connectors/redux/actions/audio'
import { addRecordingToStore } from '../../connectors/redux/actions/recording'
import { getRandomString, blobToBase64, cloneDeep } from '../../common/helpers'
import { getSegmentFromGraphql } from '../../connectors/redux/actions/segment'
import { uploadRecording } from '../../connectors/redux/actions/recording'

import PlayIcon from 'react-icons/lib/fa/play'
import StopIcon from 'react-icons/lib/fa/stop'
import RecordIcon from 'react-icons/lib/fa/circle'
import NewIcon from 'react-icons/lib/fa/refresh'
import UploadIcon from 'react-icons/lib/fa/upload'
import SpinnerIcon from 'react-icons/lib/fa/spinner'

const defaultUserConfig = {
	playConfig: {
		playMetronome: true,
		playNotes: true
	},
	recordConfig: {
		playMetronome: false,
		playNotes: false
	}
}

export interface InteractiveProps {
	dispatch: any
	startTime: number
	isRecording: boolean
	activeSegment: SegmentType
	segmentLoading: boolean
	latestRecording: RecordingType
}

export interface InteractiveState {
	randomResetKey: string
	midiVisualizerDims: { height: number; width: number }
}

export class Interactive extends React.Component<InteractiveProps, InteractiveState> {
	constructor(props: InteractiveProps) {
		super(props)
		this.state = {
			randomResetKey: 'default',
			midiVisualizerDims: null
		}
	}

	public componentDidMount() {
		if (!this.props.activeSegment) {
			this.props.dispatch(getSegmentFromGraphql())
		}
	}

	public componentWillReceiveProps(nextProps: InteractiveProps) {
		const { activeSegment } = this.props
		if (activeSegment && cloneDeep(activeSegment) !== cloneDeep(nextProps.activeSegment)) {
			this.setState({ randomResetKey: getRandomString() })
		}
	}

	private handleSetMidiVisualizerDims(ref: any): void {
		if (this.state.midiVisualizerDims) return
		const { clientWidth, clientHeight } = ref
		this.setState({ midiVisualizerDims: { width: clientWidth, height: clientHeight } })
	}

	private renderMidiVisualizer(): JSX.Element {
		if (!this.props.activeSegment || !this.state.midiVisualizerDims || this.props.segmentLoading) return null

		const { notes } = this.props.activeSegment.midiJson.tracks[0]

		return notes ? (
			<MidiVisualizer
				key={`visualizer-${this.state.randomResetKey}`}
				audioContext={AudioEngine.audioContext}
				height={this.state.midiVisualizerDims.height}
				width={this.state.midiVisualizerDims.width}
				startTime={this.props.startTime}
				notes={notes}
			/>
		) : null
	}

	private handleStop(): void {
		this.props.dispatch(stopRecording())
		const blob = AudioEngine.stopRecording(this.props.isRecording)
		const startTime = this.props.startTime

		if (blob) {
			blobToBase64(blob).then((base64blob: string) => {
				this.props.dispatch(
					addRecordingToStore({
						base64blob,
						startTime,
						segment: this.props.activeSegment,
						recordingDate: new Date().toString()
					})
				)
			})
		}
	}

	private handleStartRecording(recordingSessionConfig: RecordingSessionConfigType) {
		AudioEngine.startRecording(recordingSessionConfig)
		this.props.dispatch(startRecording(recordingSessionConfig.startTime))
	}

	private getRecordingSessionConfig(isMockRecording: boolean): RecordingSessionConfigType {
		const startTime = AudioEngine.audioContext.currentTime
		const configProfile = isMockRecording ? 'playConfig' : 'recordConfig'
		return {
			isMockRecording,
			startTime,
			segment: this.props.activeSegment,
			playMetronome: defaultUserConfig[configProfile].playMetronome,
			playNotes: defaultUserConfig[configProfile].playNotes
		}
	}

	renderNewSegmentIcon(): JSX.Element {
		const { isRecording, segmentLoading } = this.props

		return isRecording ? (
			<NewIcon className="reimagine-unclickable" />
		) : (
			<NewIcon
				className={segmentLoading ? 'reimagine-spin reimagine-unclickable' : ''}
				onClick={() => this.props.dispatch(getSegmentFromGraphql())}
			/>
		)
	}

	renderRecordButton(): JSX.Element {
		return this.props.isRecording ? (
			<RecordIcon className="reimagine-unclickable" />
		) : (
			<RecordIcon onClick={() => this.handleStartRecording(this.getRecordingSessionConfig(false))} />
		)
	}

	renderPlayIcon(): JSX.Element {
		return this.props.isRecording ? (
			<PlayIcon className="reimagine-unclickable" />
		) : (
			<PlayIcon onClick={() => this.handleStartRecording(this.getRecordingSessionConfig(true))} />
		)
	}

	renderStopIcon(): JSX.Element {
		return this.props.isRecording ? (
			<StopIcon onClick={this.handleStop.bind(this)} />
		) : (
			<StopIcon className="reimagine-unclickable" />
		)
	}

	renderUploadIcon(): JSX.Element {
		if (!this.props.latestRecording) return <div />
		const { isUploading, id } = this.props.latestRecording
		const uploadClickHandler =
			isUploading || id ? null : () => this.props.dispatch(uploadRecording(this.props.latestRecording))
		const icon = isUploading ? (
			<SpinnerIcon className="reimagine-spin" />
		) : (
			<UploadIcon
				className={id || this.props.isRecording ? 'reimagine-unclickable' : ''}
				onClick={uploadClickHandler}
			/>
		)
		return <div>{icon}</div>
	}

	renderOverlay(): JSX.Element {
		return (
			<div className="reimagine-interactive-overlay">
				<div>{this.renderNewSegmentIcon()}</div>
				<div>
					{this.renderPlayIcon()}
					{this.renderStopIcon()}
					{this.renderRecordButton()}
				</div>
				{this.renderUploadIcon()}
			</div>
		)
	}

	render() {
		return (
			<div className="reimagine-interactive" ref={this.handleSetMidiVisualizerDims.bind(this)}>
				{this.renderOverlay()}
				<div className="reimagine-interactive-midiVisualizer">{this.renderMidiVisualizer()}</div>
			</div>
		)
	}
}

const mapStateToProps = (store: StoreType, ownProp?: any): InteractiveProps => ({
	latestRecording: store.recording.recordings[store.recording.recordings.length - 1],
	dispatch: ownProp.dispatch,
	startTime: store.audio.startTime,
	isRecording: !!store.audio.startTime,
	activeSegment: store.segment.activeSegment,
	segmentLoading: store.segment.segmentLoading
})

export default withSiteData(connect(mapStateToProps)(Interactive))

import * as React from 'react'
import MidiVisualizer from 'react-midi-visualizer'
import {
	SegmentType,
	RecordingSessionConfigType,
	RecordingType,
	UploadState,
	PlaySessionConfigType,
	AudioSessionConfigType,
	AudioEventType
} from '../../common/types'
import { connect } from 'react-redux'
import { withSiteData } from 'react-static'
import { StoreType } from '../../connectors/redux/reducers'
import AudioEngine from '../../audio-engine'
import {
	setActiveAudioConfig,
	removeActiveAudioConfig
} from '../../connectors/redux/actions/audio'
import { addRecordingToStore } from '../../connectors/redux/actions/recording'
import { getRandomString, blobToBase64, cloneDeep } from '../../common/helpers'
import { getSegmentFromGraphql } from '../../connectors/redux/actions/segment'
import { SettingsStoreStateType } from '../../connectors/redux/reducers/settings'

import RecordIcon from 'react-icons/lib/fa/circle'
import NewIcon from 'react-icons/lib/fa/refresh'
import EarIcon from 'react-icons/lib/md/hearing'
import CloseIcon from 'react-icons/lib/fa/close'
import UploadIconWrapper from '../small-components/upload-icon'

const { Playing, Recording } = AudioEventType

export interface InteractiveProps {
	dispatch: any
	startTime: number
	activeAudio: AudioSessionConfigType
	activeSegment: SegmentType
	segmentLoading: boolean
	latestRecording: RecordingType
	settings: SettingsStoreStateType
}

export interface InteractiveState {
	randomResetKey: string
	midiVisualizerDims: { height: number; width: number }
	lastRecordingWasComplete: boolean
}

export class Interactive extends React.Component<
	InteractiveProps,
	InteractiveState
> {
	private static recordStopper: NodeJS.Timer
	private static playStopper: NodeJS.Timer

	constructor(props: InteractiveProps) {
		super(props)
		this.state = {
			randomResetKey: 'default',
			midiVisualizerDims: null,
			lastRecordingWasComplete: false
		}
	}

	public componentDidMount() {
		if (!this.props.activeSegment) {
			this.props.dispatch(getSegmentFromGraphql())
		}
	}

	public componentWillReceiveProps(nextProps: InteractiveProps) {
		const { activeSegment } = this.props
		if (
			activeSegment &&
			cloneDeep(activeSegment) !== cloneDeep(nextProps.activeSegment)
		) {
			this.setState({ randomResetKey: getRandomString() })
		}
	}

	private handleSetMidiVisualizerDims(ref: any): void {
		if (this.state.midiVisualizerDims) return
		const { clientWidth, clientHeight } = ref
		this.setState({
			midiVisualizerDims: { width: clientWidth, height: clientHeight }
		})
	}

	private renderMidiVisualizer(): JSX.Element {
		if (
			!this.props.activeSegment ||
			!this.state.midiVisualizerDims ||
			this.props.segmentLoading
		)
			return null

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

	private basicStopAudioEngine(): void {
		console.log('stopping')
		if (Interactive.recordStopper) {
			clearTimeout(Interactive.recordStopper)
			Interactive.recordStopper = null
		}
		if (Interactive.playStopper) {
			clearTimeout(Interactive.playStopper)
			Interactive.playStopper = null
		}
		this.props.dispatch(removeActiveAudioConfig())
		this.setState({ lastRecordingWasComplete: false })
		AudioEngine.stopRecording(!!this.props.activeAudio)
	}

	private stopAudioEngineAndSave(): void {
		const blob = AudioEngine.stopRecording(!!this.props.activeAudio)
		const startTime = this.props.startTime
		this.props.dispatch(removeActiveAudioConfig())
		if (blob) {
			this.setState({ lastRecordingWasComplete: true })
			blobToBase64(blob).then((base64Blob: string) => {
				this.props.dispatch(
					addRecordingToStore({
						base64Blob,
						startTime,
						samplingRate: AudioEngine.audioContext.sampleRate,
						segment: this.props.activeSegment,
						recordingDate: new Date().toString(),
						uploadState: UploadState.CanUpload
					})
				)
			})
		}
	}

	private handleStartRecording(
		recordingSessionConfig: Partial<RecordingSessionConfigType>
	) {
		const fullConfig = {
			...recordingSessionConfig,
			startTime: AudioEngine.audioContext.currentTime
		} as RecordingSessionConfigType

		const recordingLength = (fullConfig.segment.midiJson.duration + 0.5) * 1000
		Interactive.recordStopper = setTimeout(() => {
			this.stopAudioEngineAndSave()
		}, recordingLength)

		AudioEngine.startRecording(fullConfig)
		this.props.dispatch(setActiveAudioConfig(fullConfig))
	}

	private handleStartPlaying(
		recordingSessionConfig: Partial<PlaySessionConfigType>
	) {
		const fullConfig = {
			...recordingSessionConfig,
			startTime: AudioEngine.audioContext.currentTime
		} as PlaySessionConfigType
		const recordingLength = (fullConfig.segment.midiJson.duration + 0.5) * 1000
		Interactive.playStopper = setTimeout(() => {
			this.stopAudioEngineAndSave()
		}, recordingLength)

		AudioEngine.startPlaying(fullConfig)
		this.props.dispatch(setActiveAudioConfig(fullConfig))
	}

	renderNewSegmentIcon(): JSX.Element {
		const { activeAudio, segmentLoading } = this.props

		return activeAudio ? (
			<NewIcon className="reimagine-unclickable" />
		) : (
			<NewIcon
				className={segmentLoading ? 'reimagine-spin reimagine-unclickable' : ''}
				onClick={() => this.props.dispatch(getSegmentFromGraphql())}
			/>
		)
	}

	renderRecordButton(): JSX.Element {
		const { activeSegment, settings, activeAudio } = this.props

		switch (true) {
			case !activeSegment:
			case activeAudio && activeAudio.type === Playing:
				return <RecordIcon className="reimagine-unclickable" />
			case activeAudio && activeAudio.type === Recording:
				return <CloseIcon onClick={this.basicStopAudioEngine.bind(this)} />
			default:
				const config: Partial<RecordingSessionConfigType> = {
					segment: activeSegment,
					playMetronome: settings.playRecordConfigs.recordConfig.playMetronome,
					playNotes: settings.playRecordConfigs.recordConfig.playNotes,
					type: Recording
				}

				return <RecordIcon onClick={() => this.handleStartRecording(config)} />
		}
	}

	renderEarIcon(): JSX.Element {
		const { settings, activeSegment, activeAudio } = this.props

		switch (true) {
			case !activeSegment:
			case activeAudio && activeAudio.type === Recording:
				return <EarIcon className="reimagine-unclickable" />
			case activeAudio && activeAudio.type === Playing:
				return <CloseIcon onClick={this.basicStopAudioEngine.bind(this)} />
			default:
				const config: Partial<PlaySessionConfigType> = {
					segment: activeSegment,
					playMetronome:
						settings.playRecordConfigs.playSegmentConfig.playMetronome,
					playNotes: settings.playRecordConfigs.playSegmentConfig.playNotes,
					type: Playing
				}
				return <EarIcon onClick={() => this.handleStartPlaying(config)} />
		}
	}

	renderOverlay(): JSX.Element {
		return (
			<div className="reimagine-interactive-buttons">
				<div>
					{this.renderNewSegmentIcon()}
					{this.renderEarIcon()}
				</div>
				<div>
					{this.renderRecordButton()}
					<UploadIconWrapper
						recording={
							this.state.lastRecordingWasComplete && this.props.latestRecording
						}
					/>
				</div>
			</div>
		)
	}

	render() {
		return (
			<div
				className="reimagine-interactive"
				ref={this.handleSetMidiVisualizerDims.bind(this)}
			>
				{this.renderOverlay()}
				<div className="reimagine-interactive-midiVisualizer">
					{this.renderMidiVisualizer()}
				</div>
			</div>
		)
	}
}

const mapStateToProps = (
	store: StoreType,
	ownProp?: any
): InteractiveProps => ({
	latestRecording:
		store.recording.recordings[store.recording.recordings.length - 1],
	dispatch: ownProp.dispatch,
	startTime:
		store.audio.activeAudioConfig && store.audio.activeAudioConfig.startTime,
	activeAudio: store.audio.activeAudioConfig,
	activeSegment: store.segment.activeSegment,
	segmentLoading: store.segment.segmentLoading,
	settings: store.settings
})

export default withSiteData(connect(mapStateToProps)(Interactive))

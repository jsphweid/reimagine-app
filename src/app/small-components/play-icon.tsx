import { RecordingType, PlaySessionConfigType, AudioEventType, AudioSessionConfigType } from '../../common/types'
import PlayIcon from 'react-icons/lib/fa/play'
import StopIcon from 'react-icons/lib/fa/stop'
import AudioEngine from '../../audio-engine'
import * as React from 'react'
import { withSiteData } from 'react-static'
import { connect } from 'react-redux'
import { StoreType } from '../../connectors/redux/reducers'
import { SettingsStoreStateType } from '../../connectors/redux/reducers/settings'
import {
	setAudioElement,
	stopPlayingAudioElement,
	removeActiveAudioConfig,
	setActiveAudioConfig
} from '../../connectors/redux/actions/audio'
import { base64ToBlob } from '../../common/helpers'

export interface PlayIconWrapperProps {
	dispatch: any
	recording: RecordingType
	isPlaying: boolean
	settings: SettingsStoreStateType
	activeAudioElement: HTMLAudioElement
}

export class PlayIconWrapper extends React.Component<PlayIconWrapperProps> {
	constructor(props: PlayIconWrapperProps) {
		super(props)
	}

	componentWillReceiveProps(nextProps: PlayIconWrapperProps) {
		if (
			nextProps.activeAudioElement &&
			this.props.activeAudioElement &&
			nextProps.activeAudioElement !== this.props.activeAudioElement
		) {
			this.props.activeAudioElement.pause()
		}
	}

	private handleStopButtonClicked() {
		const { dispatch, activeAudioElement } = this.props
		AudioEngine.stopRecording()
		dispatch(removeActiveAudioConfig())
		dispatch(stopPlayingAudioElement())
		if (activeAudioElement) {
			activeAudioElement.pause()
		}
	}

	private handlePlayButtonClicked() {
		const { settings, dispatch, recording } = this.props

		base64ToBlob(recording.base64blob).then((blob: Blob) => {
			const config: PlaySessionConfigType = {
				type: AudioEventType.Playing,
				recordingDate: recording.recordingDate,
				startTime: AudioEngine.audioContext.currentTime,
				segment: recording.segment,
				playMetronome: settings.playRecordingConfig.playMetronome,
				playNotes: settings.playRecordingConfig.playNotes
			}

			const blobUrl = URL.createObjectURL(blob)
			const audioElement = new Audio(blobUrl)
			audioElement.play()
			AudioEngine.startPlaying(config)
			dispatch(setAudioElement(audioElement))
			dispatch(setActiveAudioConfig(config))
		})
	}

	public render() {
		return this.props.isPlaying ? (
			<StopIcon onClick={this.handleStopButtonClicked.bind(this)} />
		) : (
			<PlayIcon onClick={this.handlePlayButtonClicked.bind(this)} />
		)
	}
}

function determineIfIsPlaying(activeAudioConfig: AudioSessionConfigType, recording: RecordingType): boolean {
	return (
		activeAudioConfig &&
		recording &&
		activeAudioConfig.recordingDate &&
		activeAudioConfig.recordingDate === recording.recordingDate
	)
}

const mapStateToProps = (store: StoreType, ownProp?: any): PlayIconWrapperProps => ({
	dispatch: ownProp.dispatch,
	isPlaying: determineIfIsPlaying(store.audio.activeAudioConfig, ownProp.recording),
	recording: ownProp.recording,
	settings: store.settings,
	activeAudioElement: store.audio.activeAudioElement
})

export default withSiteData(connect(mapStateToProps)(PlayIconWrapper))

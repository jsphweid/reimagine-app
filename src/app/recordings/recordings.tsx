import * as React from 'react'
import { withSiteData } from 'react-static'
import { connect } from 'react-redux'
import { StoreType } from '../../connectors/redux/reducers'
import { RecordingType } from '../../common/types'
import { uploadRecording } from '../../connectors/redux/actions/recording'
import AudioEngine from '../../audio-engine'

export interface RecordingsProps {
	dispatch: any
	recordings: RecordingType[]
	isPlaying: boolean
}

// refactor this whole class???!?!? renderRecordings looks terrible

export class Recordings extends React.Component<RecordingsProps> {
	constructor(props: RecordingsProps) {
		super(props)
	}

	private renderRecordings(): JSX.Element[] {
		const { dispatch, isPlaying } = this.props

		return this.props.recordings.map((recording: RecordingType) => {
			const additionalClass = recording.id ? 'reimagine-recordings-recording--uploaded' : ''

			const cantUpload = recording.id || recording.isUploading
			let hoverDivText = ''

			switch (true) {
				case recording.id && !recording.isUploading:
					hoverDivText = 'Already Uploaded'
					break
				case recording.isUploading:
					hoverDivText = 'Uploading'
					break
				default:
					hoverDivText = 'Click To Upload'
			}
			const formattedDate = recording.recordingDate.toLocaleTimeString()
			const mainText = recording.isUploading
				? 'Uploading Spinner'
				: `Recording of ${recording.segment.midiJson.header.name} at ${formattedDate} (${hoverDivText})`

			const uploadOnClick = cantUpload ? null : () => dispatch(uploadRecording(recording))
			const playOnClick = isPlaying ? null : () => this.handlePlayRecording(recording)

			const playingText = isPlaying ? 'Playing...' : 'Click to Play'

			return (
				<div
					className={`reimagine-recordings-recording ${additionalClass}`}
					key={recording.recordingDate.toString()}
				>
					{mainText}
					<div className="reimagine-recordings-recording-hoverDiv">
						<div className={`${uploadOnClick ? '' : 'pointer'}`} onClick={uploadOnClick}>
							{hoverDivText}
						</div>
						<div className={`${playOnClick ? '' : 'pointer'}`} onClick={playOnClick}>
							{playingText}
						</div>
					</div>
				</div>
			)
		})
	}

	private handlePlayRecording(recording: RecordingType): void {
		const blobUrl = URL.createObjectURL(recording.blob)
		AudioEngine.playBlob(blobUrl)
		// dispatch some action
	}

	public render() {
		return this.props.recordings.length ? (
			<div className="reimagine-recordings">{this.renderRecordings()}</div>
		) : null
	}
}

const mapStateToProps = (store: StoreType, ownProp?: any): RecordingsProps => ({
	dispatch: ownProp.dispatch,
	recordings: store.recording.recordings,
	isPlaying: store.general.isPlaying
})

export default withSiteData(connect(mapStateToProps)(Recordings))

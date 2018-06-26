import { UploadState, RecordingType } from '../../common/types'
import SpinnerIcon from 'react-icons/lib/fa/spinner'
import Upload from 'react-icons/lib/fa/upload'

const { Uploading, CanUpload, Uploaded } = UploadState

import * as React from 'react'
import { withSiteData } from 'react-static'
import { connect } from 'react-redux'
import { StoreType } from '../../connectors/redux/reducers'
import { uploadRecording } from '../../connectors/redux/actions/recording'

export interface UploadIconWrapperProps {
	dispatch: any
	recording: RecordingType
	isRecording: boolean
}

export class UploadIconWrapper extends React.Component<UploadIconWrapperProps> {
	constructor(props: UploadIconWrapperProps) {
		super(props)
	}

	public render() {
		const { isRecording, recording, dispatch } = this.props
		if (!recording) return <Upload className="reimagine-unclickable" />

		const { uploadState } = recording
		const clickHandler = uploadState === CanUpload ? () => dispatch(uploadRecording(recording)) : null
		const isBusy = uploadState === Uploaded || isRecording
		return uploadState === Uploading ? (
			<SpinnerIcon className="reimagine-spin" />
		) : (
			<Upload className={isBusy ? 'reimagine-unclickable' : ''} onClick={clickHandler} />
		)
	}
}

const mapStateToProps = (store: StoreType, ownProp?: any): UploadIconWrapperProps => ({
	dispatch: ownProp.dispatch,
	isRecording: !!store.audio.activeRecordingConfig,
	recording: ownProp.recording
})

export default withSiteData(connect(mapStateToProps)(UploadIconWrapper))

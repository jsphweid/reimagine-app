import * as React from 'react'
import { connect } from 'react-redux'
import { withSiteData } from 'react-static'
import { StoreType } from '../../connectors/redux/reducers'
import Dropzone from 'react-dropzone'
import { postMidiFiles } from '../../connectors/redux/actions/admin'

export interface AdminProps {
	dispatch: any
	uploadingMidiFailure: any
	uploadingMidi: boolean
	idsOfLatestUpload: string[]
}

export interface AdminState {
	rejectedFiles: any[]
}

export class Admin extends React.Component<AdminProps, AdminState> {
	constructor(props: AdminProps) {
		super(props)
		this.state = {
			rejectedFiles: []
		}
	}

	onDrop(acceptedFiles: any[], rejectedFiles: any[]) {
		this.setState({ rejectedFiles })
		this.props.dispatch(postMidiFiles(acceptedFiles))
	}

	renderPossibleRejectedFilesError() {
		const { rejectedFiles } = this.state
		return rejectedFiles && rejectedFiles.length ? (
			<div>
				There are {rejectedFiles.length} files in this batch that cannot be
				uploaded because they aren't midi files.
			</div>
		) : null
	}

	renderPostMidiInfo() {
		const {
			uploadingMidiFailure,
			uploadingMidi,
			idsOfLatestUpload
		} = this.props
		console.log('idsOfLatestUpload', idsOfLatestUpload)
		switch (true) {
			case !!uploadingMidiFailure:
				return <p>{uploadingMidiFailure}</p>
			case uploadingMidi:
				return <p>Uploading</p>
			case !!idsOfLatestUpload && !!idsOfLatestUpload.length:
				return <p>{JSON.stringify(idsOfLatestUpload)}</p>
			default:
				return null
		}
	}

	render() {
		return (
			<div>
				<Dropzone onDrop={this.onDrop.bind(this)} accept="audio/midi">
					<p>Upload .mid</p>
				</Dropzone>
				{this.renderPostMidiInfo()}
				{this.renderPossibleRejectedFilesError()}
			</div>
		)
	}
}

const mapStateToProps = (store: StoreType, ownProp?: any): AdminProps => ({
	dispatch: ownProp.dispatch,
	uploadingMidi: store.admin.uploadingMidi,
	uploadingMidiFailure: store.admin.uploadingMidiFailure,
	idsOfLatestUpload: store.admin.idsOfLatestUpload
})

export default withSiteData(connect(mapStateToProps)(Admin))

import { RecordingType } from '../../../utils/types'
import { ADD_RECORDING_TO_STORE, UPLOAD_RECORDING_STARTED, UPLOAD_RECORDING_SUCCESS } from '../constants'
import gql from 'graphql-tag'
import client from '../../apollo'
import { blobToBase64 } from '../../../utils/helpers'

export const addRecordingToStore = (recording: RecordingType) => ({ recording, type: ADD_RECORDING_TO_STORE })
export const uploadRecordingStarted = (recording: RecordingType) => ({
	recording,
	type: UPLOAD_RECORDING_STARTED
})
export const uploadRecordingSuccess = (recording: RecordingType) => ({
	recording,
	type: UPLOAD_RECORDING_SUCCESS
})

export function uploadRecording(recording: RecordingType) {
	return (dispatch: any) => {
		dispatch(uploadRecordingStarted(recording))
		return blobToBase64(recording.blob).then((dataString: string) => {
			return client
				.mutate({
					mutation: gql`
					mutation {
						postRecording(base64Blob: "${dataString}", startTime: ${recording.startTime}, segmentId: "${recording.segment.id}") {
							id
						}
					}
				`
				})
				.then(response => {
					dispatch(uploadRecordingSuccess({ ...recording, id: response.data.postRecording.id }))
				})
				.catch((error: any) => console.error(error))
		})
	}
}

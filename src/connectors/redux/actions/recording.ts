import { RecordingType } from '../../../common/types'
import {
	ADD_RECORDING_TO_STORE,
	UPLOAD_RECORDING_STARTED,
	UPLOAD_RECORDING_SUCCESS
} from '../constants'
import gql from 'graphql-tag'
import client from '../../apollo'

export const addRecordingToStore = (recording: RecordingType) => ({
	recording,
	type: ADD_RECORDING_TO_STORE
})
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

		return client
			.mutate({
				mutation: gql`
					mutation {
						postRecording(base64Blob: "${recording.base64blob}", startTime: ${
					recording.startTime
				}, segmentId: "${recording.segment.id}", samplingRate: ${
					recording.samplingRate
				}) {
							id
						}
					}
				`
			})
			.then(() => {
				dispatch(uploadRecordingSuccess({ ...recording }))
			})
			.catch((error: any) => console.error(error))
	}
}

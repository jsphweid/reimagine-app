import { RecordingType } from '../../../common/types'
import {
	ADD_RECORDING_TO_STORE,
	UPLOAD_RECORDING_STARTED,
	UPLOAD_RECORDING_SUCCESS
} from '../constants'
import postRecording from '../../../queries/postRecording'

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
		const { base64Blob, segment, samplingRate } = recording
		return postRecording(base64Blob, segment.id, samplingRate)
			.then(() => dispatch(uploadRecordingSuccess({ ...recording })))
			.catch((error: any) => console.error(error))
	}
}

import { ADD_RECORDING_TO_STORE, UPLOAD_RECORDING_SUCCESS, UPLOAD_RECORDING_STARTED } from '../constants'
import { cloneDeep } from '../../../common/helpers'
import { RecordingType } from '../../../common/types'

export interface RecordingStoreStateType {
	recordings: RecordingType[]
}

const recordingDefaultState: RecordingStoreStateType = {
	recordings: []
}

export const getRecordingDefaultState = (): RecordingStoreStateType => cloneDeep(recordingDefaultState)

export default (
	state: RecordingStoreStateType = getRecordingDefaultState(),
	action: any = {}
): RecordingStoreStateType => {
	switch (action.type) {
		case ADD_RECORDING_TO_STORE: {
			const recordings = cloneDeep(state.recordings)
			recordings.push(action.recording)
			return {
				...state,
				recordings
			}
		}
		case UPLOAD_RECORDING_STARTED: {
			const recordings = cloneDeep(state.recordings)
			const index = recordings.findIndex(recording => recording.recordingDate === action.recording.recordingDate)
			recordings[index].isUploading = true
			return {
				...state,
				recordings
			}
		}
		case UPLOAD_RECORDING_SUCCESS: {
			const recordings = cloneDeep(state.recordings)
			const index = recordings.findIndex(recording => recording.recordingDate === action.recording.recordingDate)
			recordings[index].isUploading = false
			recordings[index].id = 'test'
			return {
				...state,
				recordings
			}
		}
		default:
			return state
	}
}

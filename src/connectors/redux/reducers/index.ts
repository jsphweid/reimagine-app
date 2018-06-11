import { combineReducers } from 'redux'

import segment, { SegmentStoreStateType, getSegmentDefaultState } from './segment'
import recording, { getRecordingDefaultState, RecordingStoreStateType } from './recording'
import general, { GeneralStoreStateType, getGeneralDefaultState } from './general'
import audio, { getAudioDefaultState, AudioStoreStateType } from './audio'

const reducer = combineReducers({
	segment,
	recording,
	general,
	audio
})

export const getSimpleDefaultStore = () => {
	return {
		segment: getSegmentDefaultState(),
		recording: getRecordingDefaultState(),
		general: getGeneralDefaultState(),
		audio: getAudioDefaultState()
	}
}

export interface StoreType {
	segment: SegmentStoreStateType
	recording: RecordingStoreStateType
	general: GeneralStoreStateType
	audio: AudioStoreStateType
}

export default reducer

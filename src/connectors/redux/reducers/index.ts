import { combineReducers } from 'redux'

import segment, { SegmentStoreStateType, getSegmentDefaultState } from './segment'
import recording, { getRecordingDefaultState, RecordingStoreStateType } from './recording'
import general, { GeneralStoreStateType, getGeneralDefaultState } from './general'
import audio, { getAudioDefaultState, AudioStoreStateType } from './audio'
import navigation, { getNavigationDefaultState, NavigationStoreStateType } from './navigation'
import settings, { getSettingsDefaultState, SettingsStoreStateType } from './settings'

const reducer = combineReducers({
	segment,
	recording,
	general,
	audio,
	navigation,
	settings
})

export const getSimpleDefaultStore = () => {
	return {
		segment: getSegmentDefaultState(),
		recording: getRecordingDefaultState(),
		general: getGeneralDefaultState(),
		audio: getAudioDefaultState(),
		navigation: getNavigationDefaultState(),
		settings: getSettingsDefaultState()
	}
}

export interface StoreType {
	segment: SegmentStoreStateType
	recording: RecordingStoreStateType
	general: GeneralStoreStateType
	audio: AudioStoreStateType
	navigation: NavigationStoreStateType
	settings: SettingsStoreStateType
}

export default reducer

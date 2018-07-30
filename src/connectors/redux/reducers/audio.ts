import { cloneDeep } from '../../../common/helpers'
import {
	SET_ACTIVE_AUDIO_CONFIG,
	REMOVE_ACTIVE_AUDIO_CONFIG,
	SET_AUDIO_ELEMENT,
	STOP_PLAYING_AUDIO_ELEMENT
} from '../constants'
import { AudioSessionConfigType } from '../../../common/types'

// mixes state and stateless paradigms
export interface AudioStoreStateType {
	activeAudioConfig: AudioSessionConfigType
	activeAudioElement: HTMLAudioElement
}

const audioDefaultState: AudioStoreStateType = {
	activeAudioConfig: null,
	activeAudioElement: null
}

export const getAudioDefaultState = (): AudioStoreStateType =>
	cloneDeep(audioDefaultState)

export default (
	state: AudioStoreStateType = getAudioDefaultState(),
	action: any = {}
): AudioStoreStateType => {
	switch (action.type) {
		case SET_ACTIVE_AUDIO_CONFIG:
			return { ...state, activeAudioConfig: action.config }
		case REMOVE_ACTIVE_AUDIO_CONFIG:
			return { ...state, activeAudioConfig: null }
		case SET_AUDIO_ELEMENT:
			return { ...state, activeAudioElement: action.element }
		case STOP_PLAYING_AUDIO_ELEMENT:
			return { ...state, activeAudioElement: null }
		default:
			return state
	}
}

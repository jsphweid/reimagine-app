import {
	SET_ACTIVE_AUDIO_CONFIG,
	REMOVE_ACTIVE_AUDIO_CONFIG,
	SET_AUDIO_ELEMENT,
	STOP_PLAYING_AUDIO_ELEMENT
} from '../constants'
import { AudioSessionConfigType } from '../../../common/types'

export const setActiveAudioConfig = (config: AudioSessionConfigType) => ({
	config,
	type: SET_ACTIVE_AUDIO_CONFIG
})

export const removeActiveAudioConfig = () => ({
	type: REMOVE_ACTIVE_AUDIO_CONFIG
})

export const setAudioElement = (element: HTMLAudioElement) => ({
	element,
	type: SET_AUDIO_ELEMENT
})

export const stopPlayingAudioElement = () => ({
	type: STOP_PLAYING_AUDIO_ELEMENT
})

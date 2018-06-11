import { TOGGLE_IS_PLAYING } from '../constants'

export const toggleIsPlaying = (isPlaying: boolean) => ({
	isPlaying,
	type: TOGGLE_IS_PLAYING
})

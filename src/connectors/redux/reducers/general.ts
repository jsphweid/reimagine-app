import { TOGGLE_IS_PLAYING } from '../constants'
import { cloneDeep } from '../../../common/helpers'
import { MainSection } from '../../../common/constants'

export interface GeneralStoreStateType {
	isPlaying: boolean
	activeMainSection: MainSection
}

const recordingDefaultState: GeneralStoreStateType = {
	isPlaying: false,
	activeMainSection: MainSection.Interactive
}

export const getGeneralDefaultState = (): GeneralStoreStateType => cloneDeep(recordingDefaultState)

export default (state: GeneralStoreStateType = getGeneralDefaultState(), action: any = {}) => {
	switch (action.type) {
		case TOGGLE_IS_PLAYING: {
			const isPlaying = action.isPlaying || !state.isPlaying
			return {
				...state,
				isPlaying
			}
		}
		default:
			return state
	}
}

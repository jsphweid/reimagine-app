import { TOGGLE_IS_PLAYING, SET_IDENTITY_TYPE } from '../constants'
import { cloneDeep } from '../../../common/helpers'
import { IdentityType } from '../../../common/types'

export interface GeneralStoreStateType {
	isPlaying: boolean
	identityType: IdentityType
}

const generalDefaultState: GeneralStoreStateType = {
	isPlaying: false,
	identityType: IdentityType.Nothing
}

export const getGeneralDefaultState = (): GeneralStoreStateType =>
	cloneDeep(generalDefaultState)

export default (
	state: GeneralStoreStateType = getGeneralDefaultState(),
	action: any = {}
) => {
	switch (action.type) {
		case TOGGLE_IS_PLAYING: {
			const isPlaying = action.isPlaying || !state.isPlaying
			return {
				...state,
				isPlaying
			}
		}
		case SET_IDENTITY_TYPE:
			return {
				...state,
				identityType: action.idType
			}
		default:
			return state
	}
}

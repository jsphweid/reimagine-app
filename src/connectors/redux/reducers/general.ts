import { TOGGLE_IS_PLAYING, SET_IDENTITY } from '../constants'
import { cloneDeep } from '../../../common/helpers'
import { IdentityType } from '../../../common/types'

export interface GeneralStoreStateType {
	isPlaying: boolean
	identityType: IdentityType
	id: string
}

const generalDefaultState: GeneralStoreStateType = {
	isPlaying: false,
	identityType: IdentityType.Nothing,
	id: null
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
		case SET_IDENTITY:
			return {
				...state,
				identityType: action.idType,
				id: action.id
			}
		default:
			return state
	}
}

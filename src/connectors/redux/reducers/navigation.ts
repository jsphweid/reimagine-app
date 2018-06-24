import { cloneDeep } from '../../../common/helpers'
import { EXPAND_HEADER, CONTRACT_HEADER } from '../constants'

export interface NavigationStoreStateType {
	headerExpanded: boolean
}

const navigationDefaultState: NavigationStoreStateType = {
	headerExpanded: false
}

export const getNavigationDefaultState = (): NavigationStoreStateType => cloneDeep(navigationDefaultState)

export default (
	state: NavigationStoreStateType = getNavigationDefaultState(),
	action: any = {}
): NavigationStoreStateType => {
	switch (action.type) {
		case EXPAND_HEADER: {
			return { ...state, headerExpanded: true }
		}
		case CONTRACT_HEADER: {
			return { ...state, headerExpanded: false }
		}
		default:
			return state
	}
}

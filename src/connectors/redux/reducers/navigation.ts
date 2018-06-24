import { cloneDeep } from '../../../common/helpers'
import { EXPAND_HEADER, CONTRACT_HEADER, ACTIVATE_SETTINGS_SCREEN, ACTIVATE_INTERACTIVE_SCREEN } from '../constants'
import { MainSection } from '../../../common/constants'

export interface NavigationStoreStateType {
	headerExpanded: boolean
	activeMainSection: MainSection
}

const navigationDefaultState: NavigationStoreStateType = {
	headerExpanded: false,
	activeMainSection: MainSection.Interactive
}

export const getNavigationDefaultState = (): NavigationStoreStateType => cloneDeep(navigationDefaultState)

export default (
	state: NavigationStoreStateType = getNavigationDefaultState(),
	action: any = {}
): NavigationStoreStateType => {
	switch (action.type) {
		case EXPAND_HEADER:
			return { ...state, headerExpanded: true }
		case CONTRACT_HEADER:
			return { ...state, headerExpanded: false }
		case ACTIVATE_SETTINGS_SCREEN:
		case ACTIVATE_INTERACTIVE_SCREEN:
			return { ...state, headerExpanded: false, activeMainSection: action.section }
		default:
			return state
	}
}

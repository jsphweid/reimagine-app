import { cloneDeep } from '../../../common/helpers'
import { PlayRecordConfigsType } from '../../../common/types'
import {
	defaultPlayRecordConfigs,
	defaultNickname
} from '../../../common/constants'
import {
	LOAD_USER_SETTINGS_SUCCESS,
	UPDATE_USER_SETTINGS_SUCCESS,
	UPDATE_USER_SETTINGS_STARTED
} from '../constants'

export interface SettingsStoreStateType {
	playRecordConfigs: PlayRecordConfigsType
	updating: boolean
	nickname: string
}

const settingsDefaultState: SettingsStoreStateType = {
	playRecordConfigs: defaultPlayRecordConfigs,
	updating: false,
	nickname: defaultNickname
}

export const getSettingsDefaultState = () => cloneDeep(settingsDefaultState)

export default (
	state: SettingsStoreStateType = getSettingsDefaultState(),
	action: any = {}
) => {
	switch (action.type) {
		case LOAD_USER_SETTINGS_SUCCESS:
			return { ...state, ...action.userSettings }
		case UPDATE_USER_SETTINGS_STARTED:
			return { ...state, updating: true }
		case UPDATE_USER_SETTINGS_SUCCESS:
			return { ...state, ...action.updates, updating: false }
		default:
			return state
	}
}

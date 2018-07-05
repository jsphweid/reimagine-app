import {
	GET_USER_SETTINGS_STARTED,
	GET_USER_SETTINGS_SUCCESS
} from '../constants'
import getUserSettings from '../../../queries/getUserSettings'
import createUserSettings from '../../../queries/createUserSettings'
import { getSettingsDefaultState } from '../reducers/settings'
import { syncStoreWithCurrentIdentity } from './general'

export const loadingUserSettings = () => ({ type: GET_USER_SETTINGS_STARTED })
export const loadUserSettingsSuccess = (userSettings: any) => ({
	userSettings,
	type: GET_USER_SETTINGS_SUCCESS
})

export function loadUserSettings() {
	return async (dispatch: any) => {
		dispatch(loadingUserSettings())
		dispatch(syncStoreWithCurrentIdentity())

		const userSettingsResponse = await getUserSettings()
		if (!userSettingsResponse) throw 'could not make user settings call'

		let userSettings = userSettingsResponse.data.getUserSettings

		if (userSettings) {
			return dispatch(loadUserSettingsSuccess(userSettings))
		}

		userSettings = await createUserSettings(getSettingsDefaultState())

		if (!userSettings) throw 'could not create user settings in db'

		return dispatch(loadUserSettingsSuccess(userSettings))
	}
}

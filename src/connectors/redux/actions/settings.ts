import {
	LOAD_USER_SETTINGS_STARTED,
	LOAD_USER_SETTINGS_SUCCESS,
	UPDATE_USER_SETTINGS_STARTED,
	UPDATE_USER_SETTINGS_SUCCESS
} from '../constants'
import getUserSettings from '../../../queries/getUserSettings'
import createUserSettings from '../../../queries/createUserSettings'
import updateUserSettings from '../../../queries/updateUserSettings'
import {
	getSettingsDefaultState,
	SettingsStoreStateType
} from '../reducers/settings'
import { syncStoreWithCurrentIdentity } from './general'
import { getCurrentCredentials } from '../../amplify'

const loadUserSettingsStart = () => ({ type: LOAD_USER_SETTINGS_STARTED })
const loadUserSettingsSuccess = (userSettings: any) => ({
	userSettings,
	type: LOAD_USER_SETTINGS_SUCCESS
})

const updateUserSettingsStart = () => ({
	type: UPDATE_USER_SETTINGS_STARTED
})

const updateUserSettingsSuccess = (updates: any) => ({
	updates,
	type: UPDATE_USER_SETTINGS_SUCCESS
})

export function loadUserSettings() {
	return async (dispatch: any) => {
		dispatch(loadUserSettingsStart())
		const creds = await getCurrentCredentials()

		dispatch(syncStoreWithCurrentIdentity(creds))

		const userSettingsResponse = await getUserSettings(creds.params.IdentityId)

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

export function saveUserSettings(updates: Partial<SettingsStoreStateType>) {
	return async (dispatch: any) => {
		const creds = await getCurrentCredentials()
		dispatch(updateUserSettingsStart())
		delete updates.updating
		const updateResponse = await updateUserSettings(
			creds.params.IdentityId,
			updates
		)
		dispatch(updateUserSettingsSuccess(updateResponse.data.updateUserSettings))
	}
}

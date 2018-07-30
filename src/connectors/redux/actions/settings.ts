import {
	LOAD_USER_SETTINGS_STARTED,
	LOAD_USER_SETTINGS_SUCCESS,
	UPDATE_USER_SETTINGS_STARTED,
	UPDATE_USER_SETTINGS_SUCCESS
} from '../constants'
import getUserSettingsQuery from '../../../queries/getUserSettings'
import createUserSettingsMutation from '../../../queries/createUserSettings'
import updateUserSettingsMutation from '../../../queries/updateUserSettings'
import {
	getSettingsDefaultState,
	SettingsStoreStateType
} from '../reducers/settings'
import { syncStoreWithCurrentIdentity } from './general'
import { getCurrentCredentials } from '../../amplify'
import AppSyncClient from '../../appsync'
import { cloneDeep, omitDeep } from '../../../common/helpers'

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

		const userSettingsResponse = await AppSyncClient.query({
			query: getUserSettingsQuery,
			variables: {
				id: creds.params.IdentityId
			},
			fetchPolicy: 'network-only'
		})

		if (!userSettingsResponse) throw 'could not make user settings call'

		let userSettings = userSettingsResponse.data.getUserSettings

		if (userSettings) {
			return dispatch(loadUserSettingsSuccess(userSettings))
		}

		const allDefaultSettings = getSettingsDefaultState()

		userSettings = await AppSyncClient.mutate({
			mutation: createUserSettingsMutation,
			variables: {
				input: {
					playRecordConfigs: allDefaultSettings.playRecordConfigs,
					nickname: allDefaultSettings.nickname
				}
			}
		})

		if (!userSettings) throw 'could not create user settings in db'

		return dispatch(loadUserSettingsSuccess(userSettings))
	}
}

function updatesCleanser(updates: any): Partial<SettingsStoreStateType> {
	const updatesClone = cloneDeep(updates)
	delete updatesClone.updating
	return omitDeep(updatesClone, '__typename')
}

export function saveUserSettings(updates: Partial<SettingsStoreStateType>) {
	return async (dispatch: any) => {
		const creds = await getCurrentCredentials()
		dispatch(updateUserSettingsStart())

		const updateResponse = await AppSyncClient.mutate({
			mutation: updateUserSettingsMutation,
			variables: {
				id: creds.params.IdentityId,
				input: { ...updatesCleanser(updates) }
			},
			addTypename: true
		})
		dispatch(updateUserSettingsSuccess(updateResponse.data.updateUserSettings))
	}
}

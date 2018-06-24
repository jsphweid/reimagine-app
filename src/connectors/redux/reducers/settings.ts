import { cloneDeep } from '../../../common/helpers'

export interface SettingsStoreStateType {}

const settingsDefaultState: SettingsStoreStateType = {}

export const getSettingsDefaultState = () => cloneDeep(settingsDefaultState)

export default (state: SettingsStoreStateType = getSettingsDefaultState(), action: any = {}) => {
	switch (action.type) {
		default:
			return state
	}
}

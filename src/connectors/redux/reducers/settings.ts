import { cloneDeep } from '../../../common/helpers'
import { PlayRecordConfigsType } from '../../../common/types'
import { defaultPlayRecordConfigs } from '../../../common/constants'
import { GET_USER_SETTINGS_SUCCESS } from '../constants'

export interface SettingsStoreStateType {
  playRecordConfigs: PlayRecordConfigsType
}

const settingsDefaultState: SettingsStoreStateType = {
  playRecordConfigs: defaultPlayRecordConfigs
}

export const getSettingsDefaultState = () => cloneDeep(settingsDefaultState)

export default (
  state: SettingsStoreStateType = getSettingsDefaultState(),
  action: any = {}
) => {
  switch (action.type) {
    case GET_USER_SETTINGS_SUCCESS:
      return { ...state, ...action.userSettings }
    default:
      return state
  }
}

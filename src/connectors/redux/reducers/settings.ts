import { cloneDeep } from '../../../common/helpers'
import { PlayRecordConfigType } from '../../../common/types'

export interface SettingsStoreStateType {
	playSegmentConfig: PlayRecordConfigType
	playRecordingConfig: PlayRecordConfigType
	recordConfig: PlayRecordConfigType
}

const settingsDefaultState: SettingsStoreStateType = {
	playSegmentConfig: { playMetronome: true, playNotes: true },
	playRecordingConfig: { playMetronome: false, playNotes: false },
	recordConfig: { playMetronome: false, playNotes: false }
}

export const getSettingsDefaultState = () => cloneDeep(settingsDefaultState)

export default (state: SettingsStoreStateType = getSettingsDefaultState(), action: any = {}) => {
	switch (action.type) {
		default:
			return state
	}
}

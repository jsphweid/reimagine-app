import {
	UPLOAD_MIDI_SUCCESS,
	UPLOAD_MIDI_STARTED,
	UPLOAD_MIDI_FAILURE
} from '../constants'
import { cloneDeep } from '../../../common/helpers'

export interface AdminStoreStateType {
	uploadingMidi: boolean
	idsOfLatestUpload: string[]
	uploadingMidiFailure: string
}

const adminDefaultState: AdminStoreStateType = {
	uploadingMidi: false,
	idsOfLatestUpload: null,
	uploadingMidiFailure: null
}

export const getAdminDefaultState = (): AdminStoreStateType =>
	cloneDeep(adminDefaultState)

export default (
	state: AdminStoreStateType = getAdminDefaultState(),
	action: any = {}
) => {
	switch (action.type) {
		case UPLOAD_MIDI_STARTED:
			return {
				...state,
				uploadingMidi: true,
				uploadingMidiFailure: null
			}
		case UPLOAD_MIDI_SUCCESS:
			return {
				...state,
				uploadingMidi: false,
				idsOfLatestUpload: action.ids
			}
		case UPLOAD_MIDI_FAILURE:
			return {
				...state,
				uploadingMidi: false,
				uploadingMidiFailure: action.error
			}
		default:
			return state
	}
}

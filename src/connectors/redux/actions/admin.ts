import { blobToBase64 } from '../../../common/helpers'
import {
	UPLOAD_MIDI_STARTED,
	UPLOAD_MIDI_SUCCESS,
	UPLOAD_MIDI_FAILURE
} from '../constants'
import postMidiMutation from '../../../queries/postMidi'
import AppSyncClient from '../../appsync'

const uploadMidiStarted = () => ({ type: UPLOAD_MIDI_STARTED })
const uploadMidiSuccess = (ids: string[]) => ({
	ids,
	type: UPLOAD_MIDI_SUCCESS
})
const uploadMidiFailure = (error: string) => ({
	error,
	type: UPLOAD_MIDI_FAILURE
})

export function postMidiFiles(files: File[]) {
	return async (dispatch: any) => {
		dispatch(uploadMidiStarted())
		const base64edFiles = await Promise.all(
			files.map(async file => await blobToBase64(file))
		)
		const fileBuffers = base64edFiles.map(data =>
			data.replace('data:audio/midi;base64,', '')
		)

		try {
			const response = await AppSyncClient.mutate({
				mutation: postMidiMutation,
				variables: { fileBuffers }
			})
			dispatch(uploadMidiSuccess(response.data.postMidi.ids))
		} catch (e) {
			dispatch(uploadMidiFailure(JSON.stringify(e)))
		}
	}
}

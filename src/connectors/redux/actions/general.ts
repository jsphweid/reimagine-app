import { TOGGLE_IS_PLAYING, SET_IDENTITY } from '../constants'
import { IdentityType } from '../../../common/types'

export const setIdentity = (idType: IdentityType, id: string) => ({
	idType,
	id,
	type: SET_IDENTITY
})

export const toggleIsPlaying = (isPlaying: boolean) => ({
	isPlaying,
	type: TOGGLE_IS_PLAYING
})

export function syncStoreWithCurrentIdentity(creds: any) {
	return async (dispatch: any) => {
		if (!creds) throw 'could not fetch creds'

		const id = creds.data.IdentityId

		switch (true) {
			case creds.authenticated && !!id:
				return dispatch(setIdentity(IdentityType.Google, id))
			case !creds.authenticated && !!id:
				return dispatch(setIdentity(IdentityType.Anonymous, id))
			default:
				return dispatch(setIdentity(IdentityType.Nothing, null))
		}
	}
}

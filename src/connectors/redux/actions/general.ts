import { TOGGLE_IS_PLAYING, SET_IDENTITY_TYPE } from '../constants'
import { IdentityType } from '../../../common/types'

export const setIdentityType = (idType: IdentityType) => ({
	idType,
	type: SET_IDENTITY_TYPE
})

export const toggleIsPlaying = (isPlaying: boolean) => ({
	isPlaying,
	type: TOGGLE_IS_PLAYING
})

export function syncStoreWithCurrentIdentity(creds: any) {
	return async (dispatch: any) => {
		if (!creds) throw 'could not fetch creds'
		// await AppSyncClient.resetStore()
		const hasId = !!creds.data.IdentityId
		switch (true) {
			case creds.authenticated && hasId:
				return dispatch(setIdentityType(IdentityType.Google))
			case !creds.authenticated && hasId:
				return dispatch(setIdentityType(IdentityType.Anonymous))
			default:
				return dispatch(setIdentityType(IdentityType.Nothing))
		}
	}
}

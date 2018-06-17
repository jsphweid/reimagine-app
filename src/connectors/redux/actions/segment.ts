import client from '../../apollo'

import gql from 'graphql-tag'
import { GET_SEGMENT_SUCCESS, GET_SEGMENT_LOADING } from '../constants'

export const getSegmentSuccess = (data: any) => ({ data, type: GET_SEGMENT_SUCCESS })
export const getSegmentLoading = () => ({ type: GET_SEGMENT_LOADING })

export function getSegmentFromGraphql(id?: string) {
	return (dispatch: any) => {
		dispatch(getSegmentLoading())
		const randomKey = Math.random()
			.toString(36)
			.substring(7)
		const args = id ? `id: "${id}"` : `randomKey: "${randomKey}"`
		return client
			.query({
				query: gql`
					{
						segment(${args}) {
							id
							date
							midiJson
							difficulty
							pieceId
							offsetTime
						}
					}
				`
			})
			.then(response => {
				console.log(response)
				return dispatch(getSegmentSuccess(response.data))
			})
			.catch(error => console.error(error))
	}
}

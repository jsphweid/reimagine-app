import client from '../../apollo'

import gql from 'graphql-tag'
import { GET_SEGMENT_SUCCESS, GET_SEGMENT_LOADING } from '../constants'

export const getSegmentSuccess = (data: any) => ({ data, type: GET_SEGMENT_SUCCESS })
export const getSegmentLoading = () => ({ type: GET_SEGMENT_LOADING })

export function getSegment() {
	return (dispatch: any) => {
		dispatch(getSegmentLoading())
		return client
			.query({
				query: gql`
					{
						segment {
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
			.then(response => dispatch(getSegmentSuccess(response.data)))
			.catch(error => console.error(error))
	}
}

import { GET_SEGMENT_SUCCESS, GET_SEGMENT_LOADING } from '../constants'
import AppSyncClient from '../../../connectors/appsync'
import getSegmentQuery from '../../../queries/getSegment'

export const getSegmentSuccess = (data: any) => ({
	data,
	type: GET_SEGMENT_SUCCESS
})

export const getSegmentLoading = () => ({ type: GET_SEGMENT_LOADING })

export function getSegmentFromGraphql(id?: string) {
	return (dispatch: any) => {
		dispatch(getSegmentLoading())
		return AppSyncClient.query({
			query: getSegmentQuery,
			variables: { id },
			fetchPolicy: 'network-only'
		})
			.then(response => dispatch(getSegmentSuccess(response.data)))
			.catch(error => console.error(error))
	}
}

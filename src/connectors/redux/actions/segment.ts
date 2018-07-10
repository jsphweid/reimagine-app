import { GET_SEGMENT_SUCCESS, GET_SEGMENT_LOADING } from '../constants'
import getSegment from '../../../queries/getSegment'

export const getSegmentSuccess = (data: any) => ({
	data,
	type: GET_SEGMENT_SUCCESS
})
export const getSegmentLoading = () => ({ type: GET_SEGMENT_LOADING })

export function getSegmentFromGraphql(id?: string) {
	return (dispatch: any) => {
		dispatch(getSegmentLoading())
		getSegment(id)
			.then(response => dispatch(getSegmentSuccess(response.data)))
			.catch(error => console.error(error))
	}
}

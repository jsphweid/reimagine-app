import { GET_SEGMENT_SUCCESS, GET_SEGMENT_LOADING } from '../constants'
import { cloneDeep } from '../../../utils/helpers'
import { SegmentType } from '../../../utils/types'

export interface GraphqlStoreStateType {
	activeSegment: SegmentType
	segmentLoading: boolean
}

const graphqlDefaultState: GraphqlStoreStateType = {
	activeSegment: null,
	segmentLoading: false
}

export const getGraphqlDefaultState = () => cloneDeep(graphqlDefaultState)

export default (state = getGraphqlDefaultState(), action: any = {}) => {
	switch (action.type) {
		case GET_SEGMENT_SUCCESS:
			console.log('action.data', action.data)
			const activeSegment = {
				...action.data.segment,
				midiJson: JSON.parse(action.data.segment.midiJson)
			}
			return {
				...state,
				activeSegment,
				segmentLoading: false
			}
		case GET_SEGMENT_LOADING:
			return {
				...state,
				segmentLoading: true
			}
		default:
			return state
	}
}

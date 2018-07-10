import { GET_SEGMENT_SUCCESS, GET_SEGMENT_LOADING } from '../constants'
import { cloneDeep } from '../../../common/helpers'
import { SegmentType } from '../../../common/types'

export interface SegmentStoreStateType {
	activeSegment: SegmentType
	segmentLoading: boolean
	segments: SegmentType[]
}

const segmentDefaultState: SegmentStoreStateType = {
	activeSegment: null,
	segmentLoading: false,
	segments: []
}

export const getSegmentDefaultState = () => cloneDeep(segmentDefaultState)

export default (
	state: SegmentStoreStateType = getSegmentDefaultState(),
	action: any = {}
) => {
	switch (action.type) {
		case GET_SEGMENT_SUCCESS:
			console.log('action', action)
			const { getSegment } = action.data
			const segments = state.segments.slice()
			const newSegment = {
				...getSegment,
				midiJson: JSON.parse(getSegment.midiJson)
			}
			segments.push(newSegment)
			return {
				...state,
				segments,
				activeSegment: newSegment,
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

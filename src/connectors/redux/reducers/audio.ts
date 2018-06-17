import { cloneDeep } from '../../../common/helpers'
import { START_RECORDING, STOP_RECORDING } from '../constants'
import { SegmentType } from '../../../common/types'

// mixes state and stateless paradigms
export interface AudioStoreStateType {
	audioContextOccupied: boolean
	startTime: number
	segmentBeingRecorded: SegmentType
}

const audioDefaultState: AudioStoreStateType = {
	audioContextOccupied: false,
	startTime: null,
	segmentBeingRecorded: null
}

export const getAudioDefaultState = (): AudioStoreStateType => cloneDeep(audioDefaultState)

export default (state: AudioStoreStateType = getAudioDefaultState(), action: any = {}): AudioStoreStateType => {
	switch (action.type) {
		case START_RECORDING: {
			return { ...state, startTime: action.startTime }
		}
		case STOP_RECORDING: {
			return { ...state, startTime: null }
		}
		default:
			return state
	}
}

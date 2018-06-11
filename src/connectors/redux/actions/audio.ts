import { START_RECORDING, STOP_RECORDING, START_MOCK_RECORDING, STOP_MOCK_RECORDING } from '../constants'
import { SegmentType } from '../../../utils/types'

export const startRecording = (startTime: number) => ({
	startTime,
	type: START_RECORDING
})

export const startMockRecording = (segment: SegmentType, playMetronome: boolean, playNotes: boolean) => ({
	segment,
	playMetronome,
	playNotes,
	type: START_MOCK_RECORDING
})

export const stopRecording = () => ({
	type: STOP_RECORDING
})

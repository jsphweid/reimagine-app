import { MIDI } from 'midiconvert'

export interface SegmentType {
	date: string
	difficulty?: number
	id: string
	midiJson: MIDI
	pieceId: string
}

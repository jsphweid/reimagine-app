import { MIDI } from 'midiconvert'

export interface SegmentType {
	readonly date: Date
	readonly difficulty?: number
	readonly id: string
	readonly midiJson: MIDI
	readonly pieceId: string
}

export interface RecordingType {
	segment: SegmentType
	blob: Blob
	id?: string
	recordingDate: Date
	isUploading?: boolean
	startTime: number
}

export interface RecordingSessionConfigType {
	segment: SegmentType
	playMetronome: boolean
	playNotes: boolean
	startTime: number
	isMockRecording: boolean
}

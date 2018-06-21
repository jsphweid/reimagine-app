import { MIDI } from 'midiconvert'

export interface SegmentType {
	readonly date: Date
	readonly difficulty?: number
	readonly humanHash: string
	readonly id: string
	readonly midiJson: MIDI
	readonly pieceId: string
}

export interface RecordingType {
	segment: SegmentType
	base64blob: string
	id?: string
	recordingDate: string
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

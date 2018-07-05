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
	recordingDate: string
	uploadState: UploadState
	startTime: number
	samplingRate: number
}

export enum AudioEventType {
	Playing,
	Recording
}

export enum IdentityType {
	Anonymous = 'Anonymous',
	Google = 'Google',
	Nothing = 'Error'
}

export interface AudioSessionConfigType {
	segment: SegmentType
	playMetronome: boolean
	playNotes: boolean
	startTime: number
	type: AudioEventType
	recordingDate?: string
}

export interface RecordingSessionConfigType extends AudioSessionConfigType {
	type: AudioEventType.Recording
}

export interface PlaySessionConfigType extends AudioSessionConfigType {
	recordingDate: string
	type: AudioEventType.Playing
}

export enum UploadState {
	Uploading,
	Uploaded,
	CanUpload
}

export interface PlayRecordConfigType {
	playNotes: boolean
	playMetronome: boolean
}

export interface PlayRecordConfigsType {
	playSegmentConfig: PlayRecordConfigType
	playRecordingConfig: PlayRecordConfigType
	recordConfig: PlayRecordConfigType
}

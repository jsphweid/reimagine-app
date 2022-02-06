import { MIDI } from "midiconvert";

// TODO: do we need half this?

export interface Segment {
  readonly date: Date;
  readonly difficulty?: number;
  readonly humanHash: string;
  readonly id: string;
  readonly midiJson: MIDI;
  readonly pieceId: string;
}

export interface Recording {
  segment: Segment;
  base64Blob: string;
  recordingDate: string;
  startTime: number;
  samplingRate: number;
}

export enum AudioEvent {
  Playing,
  Recording,
}

export enum Identity {
  Anonymous = "Anonymous",
  Google = "Google",
  Nothing = "Error",
}

export interface AudioSessionConfig {
  segment: Segment;
  playMetronome: boolean;
  playNotes: boolean;
  startTime: number;
  type: AudioEvent;
  recordingDate?: string;
}

export interface RecordingSessionConfig extends AudioSessionConfig {
  type: AudioEvent.Recording;
}

export interface PlaySessionConfig extends AudioSessionConfig {
  recordingDate: string;
  type: AudioEvent.Playing;
}

import { Recording } from "./generated";

export interface LocalRecording {
  dateCreated: Date;
  segmentId: string;
  blob: Blob;
}

export type AnyRecording = Recording | LocalRecording;

export function isLocalRecording(rec: AnyRecording): rec is LocalRecording {
  return !!(rec as any).blob;
}

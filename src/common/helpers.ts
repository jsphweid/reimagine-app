import { Midi } from "@tonejs/midi";

export function cloneDeep<T>(simpleObj: T): T {
  return JSON.parse(JSON.stringify(simpleObj)) as T;
}

export function midiToFreq(midiNote: number): number {
  return Math.pow(2, (midiNote - 69) / 12) * 440;
}

export function getSecondsPerBeat(bpm: number): number {
  return 1 / (bpm / 60);
}

export function blobToBase64(blob: Blob): Promise<string> {
  const reader = new FileReader();
  reader.readAsDataURL(blob);
  return new Promise((resolve) => {
    reader.onloadend = function () {
      // TODO: as any...
      resolve((reader as any).result);
    };
  });
}

export function base64ToBlob(base64: string): Promise<Blob> {
  return fetch(base64).then((res) => res.blob());
}

export function getRandomString(): string {
  return Math.random().toString(36).substring(7);
}

export function timeSince(date: number): string {
  var seconds = Math.floor((Date.now() - date) / 1000);

  var interval = Math.floor(seconds / 31536000);

  if (interval > 1) {
    return interval + " years ago";
  }
  interval = Math.floor(seconds / 2592000);
  if (interval > 1) {
    return interval + " months ago";
  }
  interval = Math.floor(seconds / 86400);
  if (interval > 1) {
    return interval + " days ago";
  }
  interval = Math.floor(seconds / 3600);
  if (interval > 1) {
    return interval + " hours ago";
  }
  interval = Math.floor(seconds / 60);
  if (interval > 1) {
    return interval + " minutes ago";
  }
  return seconds === 0 ? "just now" : Math.floor(seconds) + " seconds ago";
}

export function omitDeep(obj: any, key: string): Object {
  const keys = Object.keys(obj);
  const newObj: any = {};
  keys.forEach((i) => {
    if (i !== key) {
      const val = obj[i];
      if (Array.isArray(val)) newObj[i] = omitDeepArrayWalk(val, key);
      else if (typeof val === "object" && val !== null)
        newObj[i] = omitDeep(val, key);
      else newObj[i] = val;
    }
  });
  return newObj;
}

function omitDeepArrayWalk(arr: any[], key: string): any[] {
  return arr.map((val) => {
    if (Array.isArray(val)) return omitDeepArrayWalk(val, key);
    else if (typeof val === "object") return omitDeep(val, key);
    return val;
  });
}

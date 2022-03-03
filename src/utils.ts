import { Note } from "./generated";

export function removeTypename<T extends { __typename?: any }>(
  obj: T
): Omit<T, "__typename"> {
  return {
    ...obj,
    __typename: undefined,
  };
}

// stolen from https://stackoverflow.com/questions/36280818/how-to-convert-file-to-base64-in-javascript
export const toBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

export const wait = (milli: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, milli);
  });

export const waitUntil = async (
  fn: () => boolean,
  maxMilli: number = 1000
): Promise<void> => {
  if (maxMilli <= 0) {
    throw new Error("waitUntil exceeded maxMilli");
  }
  if (fn()) {
    return;
  } else {
    await wait(10);
    return waitUntil(fn, maxMilli - 10);
  }
};

export function prettyPrintDuration(duration: number): string {
  const minutes = Math.floor(duration / 60);
  const seconds = Math.round(duration - minutes * 60);
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export function getRecordDurationMillis(notes: Note[]) {
  let maxTime = 0;
  notes.forEach(({ time, duration }) => {
    maxTime = Math.max(maxTime, time + duration);
  });
  return maxTime * 1000;
}

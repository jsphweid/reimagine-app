export function cloneDeep<T>(simpleObj: T): T {
	return JSON.parse(JSON.stringify(simpleObj)) as T
}

export function midiToFreq(midiNote: number): number {
	return Math.pow(2, (midiNote - 69) / 12) * 440
}

export function getSecondsPerBeat(bpm: number): number {
	return 1 / (bpm / 60)
}

export function blobToBase64(blob: Blob): Promise<string> {
	const reader = new FileReader()
	reader.readAsDataURL(blob)
	return new Promise(resolve => {
		reader.onloadend = function() {
			resolve(reader.result)
		}
	})
}

export function getRandomString(): string {
	return Math.random()
		.toString(36)
		.substring(7)
}

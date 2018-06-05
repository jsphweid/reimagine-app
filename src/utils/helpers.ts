export function cloneDeep(simpleObj: Object) {
	return JSON.parse(JSON.stringify(simpleObj))
}

export function midiToFreq(midiNote: number): number {
	return Math.pow(2, (midiNote - 69) / 12) * 440
}

export function getSecondsPerBeat(bpm: number) {
	return 1 / (bpm / 60)
}

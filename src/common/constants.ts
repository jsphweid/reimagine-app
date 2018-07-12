import { PlayRecordConfigsType } from './types'
export enum MainSection {
	Interactive,
	RecentRecordings,
	Listen,
	Settings,
	About,
	Admin
}

export const defaultPlayRecordConfigs: PlayRecordConfigsType = {
	playRecordingConfig: {
		playNotes: false,
		playMetronome: false
	},
	playSegmentConfig: {
		playNotes: true,
		playMetronome: true
	},
	recordConfig: {
		playNotes: false,
		playMetronome: false
	}
}

export const defaultNickname = 'Anonymous'

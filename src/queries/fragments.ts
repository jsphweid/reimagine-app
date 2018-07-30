import gql from 'graphql-tag'

export const WholePlayRecordConfigsObj = gql`
	fragment allPlayRecordConfigs on PlayRecordConfigs {
		playSegmentConfig {
			playNotes
			playMetronome
		}
		playRecordingConfig {
			playNotes
			playMetronome
		}
		recordConfig {
			playNotes
			playMetronome
		}
	}
`

import gql from 'graphql-tag'
import { WholePlayRecordConfigsObj } from './fragments'

export default gql`
	mutation createUserSettings($input: UserSettingsInput!) {
		createUserSettings(input: $input) {
			playRecordConfigs {
				...allPlayRecordConfigs
			}
			nickname
		}
	}
	${WholePlayRecordConfigsObj}
`

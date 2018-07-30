import gql from 'graphql-tag'
import { WholePlayRecordConfigsObj } from './fragments'

export default gql`
	mutation updateUserSettings($id: String!, $input: UserSettingsInput!) {
		updateUserSettings(id: $id, input: $input) {
			playRecordConfigs {
				...allPlayRecordConfigs
			}
			nickname
		}
	}
	${WholePlayRecordConfigsObj}
`

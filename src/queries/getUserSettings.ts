import gql from 'graphql-tag'
import { WholePlayRecordConfigsObj } from './fragments'

export default gql`
	query GetUserSettings($id: String!) {
		getUserSettings(id: $id) {
			playRecordConfigs {
				...allPlayRecordConfigs
			}
			nickname
		}
	}
	${WholePlayRecordConfigsObj}
`

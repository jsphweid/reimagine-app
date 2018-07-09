import gql from 'graphql-tag'
import AppSyncClient from '../connectors/appsync'
import { SettingsStoreStateType } from '../connectors/redux/reducers/settings'
import { wholePlayRecordConfigsObj } from './stringFragments'

export default (input: SettingsStoreStateType): Promise<any> =>
	AppSyncClient.mutate({
		mutation: gql`
      mutation createUserSettings($input: UserSettingsInput!) {
        createUserSettings(input: $input) {
          ${wholePlayRecordConfigsObj}
          nickname
        }
      }
    `,
		variables: { input }
	})

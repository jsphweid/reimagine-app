import gql from 'graphql-tag'
import AppSyncClient from '../connectors/appsync'
import { SettingsStoreStateType } from '../connectors/redux/reducers/settings'
import { wholePlayRecordConfigsObj } from './stringFragments'

export default (
	id: string,
	input: Partial<SettingsStoreStateType>
): Promise<any> =>
	AppSyncClient.mutate({
		mutation: gql`
      mutation updateUserSettings($input: UserSettingsInput!) {
        updateUserSettings(id: "${id}", input: $input) {
          ${wholePlayRecordConfigsObj}
          nickname
        }
      }
    `,
		variables: { input }
	})

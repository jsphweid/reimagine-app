import gql from 'graphql-tag'
import AppSyncClient from '../connectors/appsync'
import { wholePlayRecordConfigsObj } from './stringFragments'

export default (id: string): Promise<any> =>
	AppSyncClient.query({
		query: gql`
      {
        getUserSettings(id: "${id}") {
          ${wholePlayRecordConfigsObj}
          nickname
        }
      }
    `,
		fetchPolicy: 'network-only'
	})

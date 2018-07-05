import gql from 'graphql-tag'
import AppSyncClient from '../connectors/appsync'
import { wholePlayRecordConfigsObj } from './stringFragments'

export default (): Promise<any> =>
  AppSyncClient.query({
    query: gql`
      {
        getUserSettings {
          ${wholePlayRecordConfigsObj}
        }
      }
    `
  })

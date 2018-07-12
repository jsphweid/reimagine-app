import gql from 'graphql-tag'
import AppSyncClient from '../connectors/appsync'

export default (fileBuffers: string[]): Promise<any> =>
	AppSyncClient.mutate({
		mutation: gql`
			mutation postMidi($fileBuffers: [String]!) {
				postMidi(fileBuffers: $fileBuffers) {
					ids
				}
			}
		`,
		variables: { fileBuffers }
	})

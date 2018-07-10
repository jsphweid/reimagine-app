import gql from 'graphql-tag'
import AppSyncClient from '../connectors/appsync'

export default (
	base64Blob: string,
	segmentId: string,
	samplingRate: number
): Promise<any> =>
	AppSyncClient.mutate({
		mutation: gql`
			mutation postRecording(
				$base64Blob: String!
				$segmentId: String!
				$samplingRate: Int!
			) {
				postRecording(
					base64Blob: $base64Blob
					segmentId: $segmentId
					samplingRate: $samplingRate
				) {
					id
				}
			}
		`,
		variables: { base64Blob, segmentId, samplingRate }
	})

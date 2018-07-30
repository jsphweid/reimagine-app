import gql from 'graphql-tag'

export default gql`
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
`

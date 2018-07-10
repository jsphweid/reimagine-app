import gql from 'graphql-tag'
import AppSyncClient from '../connectors/appsync'

export default (id?: string): Promise<any> => {
	const args = id ? `(id: "${id}")` : ''
	return AppSyncClient.query({
		query: gql`
      {
        getSegment${args} {
					id
					humanHash
					date
					midiJson
					difficulty
					pieceId
					offsetTime
        }
      }
    `,
		fetchPolicy: 'network-only'
	})
}

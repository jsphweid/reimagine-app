import gql from 'graphql-tag'

export default gql`
	query GetSegment($id: String) {
		getSegment(id: $id) {
			id
			humanHash
			date
			midiJson
			difficulty
			pieceId
			offsetTime
		}
	}
`

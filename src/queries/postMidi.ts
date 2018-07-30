import gql from 'graphql-tag'

export default gql`
	mutation postMidi($fileBuffers: [String]!) {
		postMidi(fileBuffers: $fileBuffers) {
			ids
		}
	}
`

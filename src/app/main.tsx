import * as React from 'react'
import gql from 'graphql-tag'
import { Query } from 'react-apollo'

export interface MainProps {}

export interface MainState {}

const myQuery = gql`
	{
		segment {
			id
			date
			midiJson
			difficulty
			pieceId
			offsetTime
		}
	}
`

export default class Main extends React.Component<MainProps, MainState> {
	constructor(props: MainProps) {
		super(props)
		this.state = {
			activeProject: null,
			savedScrollOffset: -1
		}
	}

	componentDidMount() {
		document.title = 're:Imagine'
	}

	render() {
		return (
			<div className="reimagine">
				<Query query={myQuery}>
					{({ loading, error, data, refetch }) => {
						if (loading) return 'Loading...'
						if (error) return `Error! ${error.message}`
						console.log('data', data)
						return (
							<div>
								<button onClick={() => refetch()}>Refetch!</button>
								<p>{data.segment.id}</p>
							</div>
						)
					}}
				</Query>
			</div>
		)
	}
}

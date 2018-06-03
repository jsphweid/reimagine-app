import * as React from 'react'
import gql from 'graphql-tag'
import { Query } from 'react-apollo'
import MidiVisualizer from 'react-midi-visualizer'

export interface MainProps {}

export interface MainState {
	startTime: number
	reactResetKey: string
}

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
	audioContext: AudioContext

	constructor(props: MainProps) {
		super(props)
		this.state = {
			startTime: null,
			reactResetKey: 'firstKey'
		}
	}

	componentDidMount() {
		document.title = 're:Imagine'
		this.audioContext = new AudioContext()
	}

	private renderMidiVisualizer(data: any): JSX.Element {
		const notes = JSON.parse(data.segment.midiJson).tracks[0].notes
		console.log('notes', notes)
		return notes ? (
			<div>
				<button onClick={() => this.setState({ startTime: this.audioContext.currentTime })}>START!</button>
				<MidiVisualizer
					key={`MidiVisualizer${this.state.reactResetKey}`}
					audioContext={this.audioContext}
					height={500}
					width={800}
					startTime={this.state.startTime}
					notes={notes}
				/>
			</div>
		) : null
	}

	render() {
		return (
			<div className="reimagine">
				<Query query={myQuery}>
					{({ loading, error, data, refetch }) => {
						if (loading) return 'Loading...'
						if (error) return `Error! ${error.message}`

						return (
							<div>
								<button
									onClick={() => {
										this.setState({
											reactResetKey: Math.random()
												.toString(36)
												.substring(7)
										})
										refetch()
									}}
								>
									New Segment
								</button>
								{this.renderMidiVisualizer(data)}
							</div>
						)
					}}
				</Query>
			</div>
		)
	}
}

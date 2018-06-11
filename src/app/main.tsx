import * as React from 'react'
import { getSegmentFromGraphql } from '../connectors/redux/actions/segment'
import { withSiteData } from 'react-static'
import { connect } from 'react-redux'
import { SegmentType } from '../utils/types'
import InteractiveComponent from './interactive/interactive'
import Recordings from './recordings/recordings'
import { StoreType } from '../connectors/redux/reducers'

export interface MainProps {
	dispatch: any
	activeSegment: SegmentType
	segmentLoading: boolean
}

export interface MainState {
	reactResetKey: string
}

export class Main extends React.Component<MainProps, MainState> {
	constructor(props: MainProps) {
		super(props)
		this.state = {
			reactResetKey: 'firstKey'
		}
	}

	componentDidMount() {
		document.title = 're:Imagine'
	}

	private renderInteractivePart(): JSX.Element {
		const { segmentLoading, activeSegment } = this.props
		switch (true) {
			default:
			case !segmentLoading && !activeSegment:
				return <div>Fetch a segment and let's get started.</div>
			case segmentLoading:
				return <div>LOADING!!</div>
			case !!activeSegment:
				return <InteractiveComponent key={this.state.reactResetKey} segment={this.props.activeSegment} />
		}
	}

	private handleNewSegment(): void {
		this.setState({
			reactResetKey: Math.random()
				.toString(36)
				.substring(7)
		})
		this.props.dispatch(getSegmentFromGraphql())
	}

	render() {
		return (
			<div className="reimagine">
				<Recordings />
				<button onClick={this.handleNewSegment.bind(this)}>Fetch Segment</button>
				{this.renderInteractivePart()}
			</div>
		)
	}
}

const mapStateToProps = (store: StoreType, ownProp?: any): MainProps => ({
	dispatch: ownProp.dispatch,
	activeSegment: store.segment.activeSegment,
	segmentLoading: store.segment.segmentLoading
})

export default withSiteData(connect(mapStateToProps)(Main))

import * as React from 'react'
import { withSiteData } from 'react-static'
import { connect } from 'react-redux'
import { SegmentType } from '../common/types'
import Interactive from './interactive/interactive'
import { StoreType } from '../connectors/redux/reducers'
import { MainSection } from '../common/constants'
import Navigation from './navigation/navigation'
import Settings from './settings/settings'

export interface MainProps {
	dispatch: any
	activeSegment: SegmentType
	segmentLoading: boolean
	activeMainSection: MainSection
}

export class Main extends React.Component<MainProps, null> {
	constructor(props: MainProps) {
		super(props)
	}

	componentDidMount() {
		document.title = 're:Imagine'
	}

	private renderMainArea(): JSX.Element {
		switch (this.props.activeMainSection) {
			default:
			case MainSection.Interactive:
				return <Interactive />
			case MainSection.Settings:
				return <Settings />
		}
	}

	render() {
		return (
			<div className="reimagine">
				<Navigation />
				<div className="reimagine-mainArea">{this.renderMainArea()}</div>
			</div>
		)
	}
}

const mapStateToProps = (store: StoreType, ownProp?: any): MainProps => ({
	dispatch: ownProp.dispatch,
	activeSegment: store.segment.activeSegment,
	segmentLoading: store.segment.segmentLoading,
	activeMainSection: store.navigation.activeMainSection
})

export default withSiteData(connect(mapStateToProps)(Main))

import * as React from 'react'
import { withSiteData } from 'react-static'
import { connect } from 'react-redux'
import { SegmentType } from '../common/types'
import Interactive from './interactive/interactive'
import { StoreType } from '../connectors/redux/reducers'
import { MainSection } from '../common/constants'
import Navigation from './navigation/navigation'
import Settings from './settings/settings'
import About from './about/about'
import Listen from './listen/listen'
import Admin from './admin/admin'
import RecentRecordings from './recent-recordings/recent-recordings'

import { loadUserSettings } from '../connectors/redux/actions/settings'

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
		// this.props.dispatch(loadUserSettings()) // inactive
	}

	private renderMainArea(): JSX.Element {
		switch (this.props.activeMainSection) {
			default:
				return <div>Project is currently inactive as of 2019-01-23.</div>
			// inactie
			// case MainSection.Interactive:
			// 	return <Interactive />
			// case MainSection.Settings:
			// 	return <Settings />
			// case MainSection.RecentRecordings:
			// 	return <RecentRecordings />
			// case MainSection.About:
			// 	return <About />
			// case MainSection.Listen:
			// 	return <Listen />
			// case MainSection.Admin:
			// 	return <Admin />
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

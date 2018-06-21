import * as React from 'react'
import { connect } from 'react-redux'
import { withSiteData } from 'react-static'
import { StoreType } from '../../connectors/redux/reducers'

import BarsIcon from 'react-icons/lib/fa/bars'
import MusicIcon from 'react-icons/lib/fa/music'

export interface NavigationProps {
	dispatch: any
}

export class Navigation extends React.Component<NavigationProps, any> {
	constructor(props: NavigationProps) {
		super(props)
	}

	renderQuickSwap() {
		return <MusicIcon />
	}

	render() {
		return (
			<div className="reimagine-navigation">
				<div className="reimagine-navigation-title">re:imagine</div>
				<div className="reimagine-navigation-mainIcons">
					{this.renderQuickSwap()}
					<BarsIcon />
				</div>
			</div>
		)
	}
}

const mapStateToProps = (store: StoreType, ownProp?: any): NavigationProps => ({
	dispatch: ownProp.dispatch
})

export default withSiteData(connect(mapStateToProps)(Navigation))

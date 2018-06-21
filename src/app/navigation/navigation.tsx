import * as React from 'react'
import { connect } from 'react-redux'
import { withSiteData } from 'react-static'
import { StoreType } from '../../connectors/redux/reducers'

export interface NavigationProps {
	dispatch: any
}

export class Navigation extends React.Component<NavigationProps, any> {
	constructor(props: NavigationProps) {
		super(props)
	}

	render() {
		return <div className="reimagine-navigation">Reimagine</div>
	}
}

const mapStateToProps = (store: StoreType, ownProp?: any): NavigationProps => ({
	dispatch: ownProp.dispatch
})

export default withSiteData(connect(mapStateToProps)(Navigation))

import * as React from 'react'
import { connect } from 'react-redux'
import { withSiteData } from 'react-static'
import { StoreType } from '../../connectors/redux/reducers'

export interface NavigationComponentProps {
	dispatch: any
}

export class NavigationComponent extends React.Component<NavigationComponentProps, any> {
	constructor(props: NavigationComponentProps) {
		super(props)
	}

	render() {
		return <div className="reimagine-navigation">hi</div>
	}
}

const mapStateToProps = (store: StoreType, ownProp?: any): InteractiveComponentProps => ({
	dispatch: ownProp.dispatch
})

export default withSiteData(connect(mapStateToProps)(InteractiveComponent))

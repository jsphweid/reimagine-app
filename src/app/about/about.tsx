import * as React from 'react'
import { withSiteData } from 'react-static'
import { connect } from 'react-redux'
import { StoreType } from '../../connectors/redux/reducers'

export interface AboutProps {
	dispatch: any
}

export class About extends React.Component<AboutProps> {
	constructor(props: AboutProps) {
		super(props)
	}

	public render() {
		return (
			<div>
				re:imagine is a webapp that explores a new type of music composition:
				one that leverages the power of the internet.
			</div>
		)
	}
}

const mapStateToProps = (store: StoreType, ownProp?: any): AboutProps => ({
	dispatch: ownProp.dispatch
})

export default withSiteData(connect(mapStateToProps)(About))

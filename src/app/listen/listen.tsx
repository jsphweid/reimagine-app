import * as React from 'react'
import { withSiteData } from 'react-static'
import { connect } from 'react-redux'
import { StoreType } from '../../connectors/redux/reducers'

export interface ListenProps {
	dispatch: any
}

export class Listen extends React.Component<ListenProps> {
	constructor(props: ListenProps) {
		super(props)
	}

	public render() {
		return <div>listen</div>
	}
}

const mapStateToProps = (store: StoreType, ownProp?: any): ListenProps => ({
	dispatch: ownProp.dispatch
})

export default withSiteData(connect(mapStateToProps)(Listen))

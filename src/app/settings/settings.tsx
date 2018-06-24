import * as React from 'react'
import { withSiteData } from 'react-static'
import { connect } from 'react-redux'
import { StoreType } from '../../connectors/redux/reducers'

export interface SettingsProps {
	dispatch: any
}

export class Settings extends React.Component<SettingsProps> {
	constructor(props: SettingsProps) {
		super(props)
	}

	public render() {
		return <div>settings</div>
	}
}

const mapStateToProps = (store: StoreType, ownProp?: any): SettingsProps => ({
	dispatch: ownProp.dispatch
})

export default withSiteData(connect(mapStateToProps)(Settings))

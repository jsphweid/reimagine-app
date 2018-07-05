import * as React from 'react'
import { withSiteData } from 'react-static'
import { connect } from 'react-redux'
import { StoreType } from '../../connectors/redux/reducers'
import Checkbox from '../small-components/checkbox'
import Section from '../small-components/section'

import GoogleIcon from 'react-icons/lib/fa/google'
import AnonymousIcon from 'react-icons/lib/fa/question'

import { withFederated } from 'aws-amplify-react'

import Amplify from 'aws-amplify'
import { syncStoreWithCurrentIdentity } from '../../connectors/redux/actions/general'

import { amplifyConfig, signOut } from '../../connectors/amplify'
import { IdentityType } from '../../common/types'

Amplify.configure(amplifyConfig)

const federated = {
	google_client_id:
		'1011815229181-uaa68ehpvhglqr2pcfao1arerq6tk58e.apps.googleusercontent.com',
	facebook_app_id: '',
	amazon_client_id: ''
}

export interface SettingsProps {
	dispatch: any
	identity: any
}

export class Settings extends React.Component<SettingsProps> {
	constructor(props: SettingsProps) {
		super(props)
	}

	async handleSignOut() {
		await signOut()
		this.props.dispatch(syncStoreWithCurrentIdentity())
	}

	renderAuthenticator() {
		const Buttons = (props: any) => (
			<div className="reimagine-settings-identity-buttons">
				<GoogleIcon onClick={props.googleSignIn} />
				<AnonymousIcon onClick={this.handleSignOut.bind(this)} />
			</div>
		)
		const Federated = withFederated(Buttons)

		return (
			<Federated
				federated={federated}
				onStateChange={(data: any) => {
					if (data === 'signedIn') {
						this.props.dispatch(syncStoreWithCurrentIdentity())
					}
				}}
			/>
		)
	}

	public render() {
		return (
			<Section className="reimagine-settings" title="Settings">
				<div className="reimagine-settings-main">
					<Checkbox onClick={() => null} isChecked={true} />
				</div>
				<div className="reimagine-settings-identity">
					<div>
						Identity: <strong>{this.props.identity}</strong>
					</div>
					<div>{this.renderAuthenticator()}</div>
				</div>
			</Section>
		)
	}
}

const mapStateToProps = (store: StoreType, ownProp?: any): SettingsProps => ({
	dispatch: ownProp.dispatch,
	identity: store.general.identityType
})

export default withSiteData(connect(mapStateToProps)(Settings))

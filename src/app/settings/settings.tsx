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

import { amplifyConfig, signOut } from '../../connectors/amplify'
import { PlayRecordConfigsType } from '../../common/types'
import { cloneDeep } from '../../common/helpers'
import {
	saveUserSettings,
	loadUserSettings
} from '../../connectors/redux/actions/settings'

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
	updating: boolean
	playRecordConfigs: PlayRecordConfigsType
}

export interface SettingsState {
	possiblyEditedPlayRecordConfigs: PlayRecordConfigsType
}

export class Settings extends React.Component<SettingsProps, SettingsState> {
	constructor(props: SettingsProps) {
		super(props)

		this.state = {
			possiblyEditedPlayRecordConfigs: props.playRecordConfigs
		}
	}

	componentWillReceiveProps(nextProps: SettingsProps) {
		const { updating, playRecordConfigs } = this.props

		if (
			JSON.stringify(nextProps.playRecordConfigs) !==
				JSON.stringify(playRecordConfigs) ||
			(updating && !nextProps.updating)
		) {
			this.setState({
				possiblyEditedPlayRecordConfigs: nextProps.playRecordConfigs
			})
		}
	}

	async handleSignOut() {
		await signOut()
		this.props.dispatch(loadUserSettings())
	}

	renderCheckbox(
		bin: 'playSegmentConfig' | 'playRecordingConfig' | 'recordConfig',
		item: 'playMetronome' | 'playNotes'
	) {
		const toggleConfigsItem = () => {
			const newConfig = cloneDeep(this.state.possiblyEditedPlayRecordConfigs)
			newConfig[bin][item] = !newConfig[bin][item]
			this.setState({ possiblyEditedPlayRecordConfigs: newConfig })
		}

		return (
			<Checkbox
				onClick={toggleConfigsItem}
				isChecked={this.state.possiblyEditedPlayRecordConfigs[bin][item]}
			/>
		)
	}

	renderNickNameSection() {
		return (
			<div>
				<input type="text" />
			</div>
		)
	}

	renderConfigs() {
		return (
			<div className="reimagine-settings-playRecordConfigs">
				{this.renderNickNameSection()}
				Customize what you want to hear when interacting.
				<table>
					<thead>
						<tr>
							<td />
							<td>Metronome</td>
							<td>Notes</td>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>Play Segment</td>
							<td>
								{this.renderCheckbox('playSegmentConfig', 'playMetronome')}
							</td>
							<td>{this.renderCheckbox('playSegmentConfig', 'playNotes')}</td>
						</tr>
						<tr>
							<td>Record Segment</td>
							<td>{this.renderCheckbox('recordConfig', 'playMetronome')}</td>
							<td>{this.renderCheckbox('recordConfig', 'playNotes')}</td>
						</tr>
						<tr>
							<td>Play Recording</td>
							<td>
								{this.renderCheckbox('playRecordingConfig', 'playMetronome')}
							</td>
							<td>{this.renderCheckbox('playRecordingConfig', 'playNotes')}</td>
						</tr>
					</tbody>
				</table>
				{this.renderSavePlayRecordConfigsButton()}
			</div>
		)
	}

	renderSavePlayRecordConfigsButton() {
		const { playRecordConfigs, updating } = this.props
		const { possiblyEditedPlayRecordConfigs } = this.state

		const unsavedChanges =
			JSON.stringify(playRecordConfigs) !==
			JSON.stringify(possiblyEditedPlayRecordConfigs)
		return (
			<button
				className="reimagine-button"
				disabled={!unsavedChanges || updating}
				onClick={() =>
					this.props.dispatch(
						saveUserSettings({
							playRecordConfigs: possiblyEditedPlayRecordConfigs
						})
					)
				}
			>
				{updating ? 'Updating...' : unsavedChanges ? 'Save' : 'Saved'}
			</button>
		)
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
						this.props.dispatch(loadUserSettings())
					}
				}}
			/>
		)
	}

	public render() {
		return (
			<Section className="reimagine-settings" title="Settings">
				{this.renderConfigs()}
				<div className="reimagine-settings-identity">
					<div>
						Current Identity: <strong>{this.props.identity}</strong>
					</div>
					<div>Switch Identities: {this.renderAuthenticator()}</div>
				</div>
			</Section>
		)
	}
}

const mapStateToProps = (store: StoreType, ownProp?: any): SettingsProps => ({
	dispatch: ownProp.dispatch,
	identity: store.general.identityType,
	playRecordConfigs: store.settings.playRecordConfigs,
	updating: store.settings.updating
})

export default withSiteData(connect(mapStateToProps)(Settings))

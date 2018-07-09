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
import { cloneDeep } from '../../common/helpers'
import {
	saveUserSettings,
	loadUserSettings
} from '../../connectors/redux/actions/settings'
import { SettingsStoreStateType } from '../../connectors/redux/reducers/settings'

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
	settings: SettingsStoreStateType
}

export interface SettingsState {
	possiblyEditedSettings: SettingsStoreStateType
}

export class Settings extends React.Component<SettingsProps, SettingsState> {
	constructor(props: SettingsProps) {
		super(props)

		this.state = {
			possiblyEditedSettings: props.settings
		}
	}

	componentWillReceiveProps(nextProps: SettingsProps) {
		const justStartedUpdate =
			!this.props.settings.updating && nextProps.settings.updating
		if (
			JSON.stringify(this.props.settings) !==
				JSON.stringify(nextProps.settings) &&
			!justStartedUpdate
		) {
			this.setState({
				possiblyEditedSettings: nextProps.settings
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
			const newSettings = cloneDeep(this.state.possiblyEditedSettings)
			newSettings.playRecordConfigs[bin][item] = !newSettings.playRecordConfigs[
				bin
			][item]
			this.setState({ possiblyEditedSettings: newSettings })
		}

		return (
			<Checkbox
				onClick={toggleConfigsItem}
				isChecked={
					this.state.possiblyEditedSettings.playRecordConfigs[bin][item]
				}
			/>
		)
	}

	renderNicknameSection() {
		const handleNicknameChange = (e: any) => {
			const newSettings = cloneDeep(this.state.possiblyEditedSettings)
			newSettings.nickname = e.target.value
			this.setState({ possiblyEditedSettings: newSettings })
		}

		return (
			<div>
				<span>
					Nickname:
					<input
						value={this.state.possiblyEditedSettings.nickname}
						onChange={handleNicknameChange}
						type="text"
					/>
				</span>
			</div>
		)
	}

	renderConfigs() {
		return (
			<div className="reimagine-settings-playRecordConfigs">
				{this.renderNicknameSection()}
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
		const { updating } = this.props.settings
		this.state.possiblyEditedSettings

		const unsavedChanges =
			JSON.stringify(this.props.settings) !==
			JSON.stringify(this.state.possiblyEditedSettings)
		return (
			<button
				className="reimagine-button"
				disabled={!unsavedChanges || updating}
				onClick={() =>
					this.props.dispatch(
						saveUserSettings({
							...this.state.possiblyEditedSettings
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
	settings: store.settings
})

export default withSiteData(connect(mapStateToProps)(Settings))

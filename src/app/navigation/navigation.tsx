import * as React from 'react'
import { connect } from 'react-redux'
import { withSiteData } from 'react-static'
import { StoreType } from '../../connectors/redux/reducers'

import BarsIcon from 'react-icons/lib/fa/bars'
import CloseIcon from 'react-icons/lib/fa/close'
import RecordingIcon from 'react-icons/lib/io/ios-recording'
import CogIcon from 'react-icons/lib/fa/cog'
import InfoIcon from 'react-icons/lib/fa/info-circle'
import HeadphonesIcon from 'react-icons/lib/fa/headphones'
import MicrophoneIcon from 'react-icons/lib/fa/microphone'
import ComputerIcon from 'react-icons/lib/fa/desktop'

import { MainSection } from '../../common/constants'
import {
	contractHeader,
	expandHeader,
	activateSettings,
	activateInteractive,
	activateRecentRecordings,
	activateListen,
	activateAbout,
	activateAdmin
} from '../../connectors/redux/actions/navigation'

export interface NavigationProps {
	dispatch: any
	activeMainSection: MainSection
	headerExpanded: boolean
	id: string
}

export class Navigation extends React.Component<NavigationProps, any> {
	constructor(props: NavigationProps) {
		super(props)
	}

	private renderQuickSwap() {
		return this.props.activeMainSection === MainSection.Interactive ? (
			<RecordingIcon
				onClick={() => this.props.dispatch(activateRecentRecordings())}
			/>
		) : (
			<MicrophoneIcon
				onClick={() => this.props.dispatch(activateInteractive())}
			/>
		)
	}

	private renderBarsOrClose() {
		const { headerExpanded, dispatch } = this.props
		return headerExpanded ? (
			<CloseIcon onClick={() => dispatch(contractHeader())} />
		) : (
			<BarsIcon onClick={() => dispatch(expandHeader())} />
		)
	}

	private renderMenuItem(
		text: string,
		icon: JSX.Element,
		action: Function
	): JSX.Element {
		return (
			<li onClick={() => this.props.dispatch(action())}>
				<div>{text}</div>
				{icon}
			</li>
		)
	}

	private renderPossibleAdminSection(): JSX.Element {
		console.log('this.props.id', this.props.id)
		return this.props.id === 'us-east-1:4c19032d-8f02-4129-a1af-32403becb60e'
			? this.renderMenuItem('Admin', <ComputerIcon />, activateAdmin)
			: null
	}

	private renderPossibleOverlay(): JSX.Element {
		return this.props.headerExpanded ? (
			<div className="reimagine-navigation-overlay">
				<ul>
					{this.renderMenuItem('Main', <MicrophoneIcon />, activateInteractive)}
					{this.renderMenuItem(
						'Recent Recordings',
						<RecordingIcon />,
						activateRecentRecordings
					)}
					{/* {this.renderMenuItem('Listen', <HeadphonesIcon />, activateListen)} */}
					{this.renderMenuItem('Settings', <CogIcon />, activateSettings)}
					{this.renderMenuItem('About', <InfoIcon />, activateAbout)}
					{this.renderPossibleAdminSection()}
				</ul>
			</div>
		) : null
	}

	public render() {
		return (
			<div className="reimagine-navigation">
				<h1 className="reimagine-navigation-title">re:imagine</h1>
				<div className="reimagine-navigation-mainIcons">
					{this.renderQuickSwap()}
					{this.renderBarsOrClose()}
				</div>
				{this.renderPossibleOverlay()}
			</div>
		)
	}
}

const mapStateToProps = (store: StoreType, ownProp?: any): NavigationProps => ({
	dispatch: ownProp.dispatch,
	headerExpanded: store.navigation.headerExpanded,
	activeMainSection: store.navigation.activeMainSection,
	id: store.general.id
})

export default withSiteData(connect(mapStateToProps)(Navigation))

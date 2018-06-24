import {
	CONTRACT_HEADER,
	EXPAND_HEADER,
	ACTIVATE_SETTINGS_SCREEN,
	ACTIVATE_INTERACTIVE_SCREEN,
	ACTIVATE_RECENT_RECORDINGS,
	ACTIVATE_ABOUT,
	ACTIVATE_LISTEN
} from '../constants'
import { MainSection } from '../../../common/constants'

export const expandHeader = () => ({ type: EXPAND_HEADER })
export const contractHeader = () => ({ type: CONTRACT_HEADER })

export const activateSettings = () => ({ type: ACTIVATE_SETTINGS_SCREEN, section: MainSection.Settings })

export const activateInteractive = () => ({ type: ACTIVATE_INTERACTIVE_SCREEN, section: MainSection.Interactive })

export const activateRecentRecordings = () => ({
	type: ACTIVATE_RECENT_RECORDINGS,
	section: MainSection.RecentRecordings
})

export const activateAbout = () => ({ type: ACTIVATE_ABOUT, section: MainSection.About })

export const activateListen = () => ({ type: ACTIVATE_LISTEN, section: MainSection.Listen })

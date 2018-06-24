import { CONTRACT_HEADER, EXPAND_HEADER, ACTIVATE_SETTINGS_SCREEN, ACTIVATE_INTERACTIVE_SCREEN } from '../constants'
import { MainSection } from '../../../common/constants'

export const expandHeader = () => ({ type: EXPAND_HEADER })
export const contractHeader = () => ({ type: CONTRACT_HEADER })

export const activateSettings = () => ({ type: ACTIVATE_SETTINGS_SCREEN, section: MainSection.Settings })

export const activateInteractive = () => ({ type: ACTIVATE_INTERACTIVE_SCREEN, section: MainSection.Interactive })

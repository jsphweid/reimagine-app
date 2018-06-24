import { CONTRACT_HEADER, EXPAND_HEADER } from '../constants'

export const expandHeader = () => ({ type: EXPAND_HEADER })
export const contractHeader = () => ({ type: CONTRACT_HEADER })

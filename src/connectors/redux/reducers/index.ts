import { combineReducers } from 'redux'

import graphql, { GraphqlStoreStateType } from './graphql'
import { getGraphqlDefaultState } from './graphql'

const reducer = combineReducers({
	graphql
})

export const getSimpleDefaultStore = () => {
	return {
		graphql: getGraphqlDefaultState()
	}
}

export interface SimpleDefaultStoreType {
	graphql: GraphqlStoreStateType
}

export default reducer

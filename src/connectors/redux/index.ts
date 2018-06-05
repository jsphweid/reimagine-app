import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'

import reducer from './reducers'

if (typeof window === 'undefined') {
	;(<any>global).window = {}
}

const store = createStore(reducer, applyMiddleware(thunk))

export default store

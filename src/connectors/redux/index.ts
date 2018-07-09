import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'

import reducer from './reducers'

if (typeof window === 'undefined') {
	;(<any>global).window = {}
}

let win: any = window

const composeEnhancers = win.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__

const store: any = createStore(
	reducer,
	composeEnhancers(applyMiddleware(thunk))
)

export default store

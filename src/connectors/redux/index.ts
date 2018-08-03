import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'

import reducer from './reducers'

let store

// when statically rendering... don't enable devtools... (which requires the window object)
const win: any = window
if (typeof window !== 'undefined' && win.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) {
	store = createStore(
		reducer,
		win.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__(applyMiddleware(thunk))
	)
} else {
	store = createStore(reducer, applyMiddleware(thunk))
}

export default store

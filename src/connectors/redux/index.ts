import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'

import reducer from './reducers'

let store

// when statically rendering... don't enable devtools... (which requires the window object)
if (typeof window === 'undefined') {
	store = createStore(reducer, applyMiddleware(thunk))
} else {
	const win: any = window
	store = createStore(
		reducer,
		win.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__(applyMiddleware(thunk))
	)
}

export default store

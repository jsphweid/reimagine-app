import { createStore } from 'redux'

import reducer from './reducers'

if (typeof window === 'undefined') {
	;(<any>global).window = {}
}

/* eslint-disable no-underscore-dangle */
const store = createStore(
	reducer,
	{}, // initial state
	(<any>window).__REDUX_DEVTOOLS_EXTENSION__ && (<any>window).__REDUX_DEVTOOLS_EXTENSION__()
)
/* eslint-enable */

export default store

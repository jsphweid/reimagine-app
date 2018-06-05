import * as React from 'react'
import Main from './app/main'
import './app.scss'

import { Provider as ReduxProvider } from 'react-redux'
import store from './connectors/redux'

const app = () => (
	<ReduxProvider store={store}>
		<Main />
	</ReduxProvider>
)

export default app

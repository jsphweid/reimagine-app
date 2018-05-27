import React from 'react'
import Main from './app/main'
import './app.scss'

import { ApolloProvider } from 'react-apollo'
import { Provider as ReduxProvider } from 'react-redux'
import client from './connectors/apollo'
import store from './connectors/redux'

const app = (
	<ApolloProvider client={client}>
		<ReduxProvider store={store}>
			<Main />
		</ReduxProvider>
	</ApolloProvider>
)

export default app

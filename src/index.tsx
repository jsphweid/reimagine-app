import * as React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'

import App from './App'

if (typeof document !== 'undefined') {
	const renderMethod = module.hot ? ReactDOM.render : ReactDOM.hydrate
	const render = (Comp: React.ComponentType) => {
		renderMethod(
			<AppContainer>
				<Comp />
			</AppContainer>,
			document.getElementById('root')
		)
	}

	render(App)

	if (module.hot) {
		module.hot.accept('./App', () => {
			render(require('./App').default)
		})
	}
}

export default App

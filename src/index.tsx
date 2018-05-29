import * as React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'

// Your top level component
import App from './App'

// Export your top level component (for static rendering)
// Render your app
console.log('lol')
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

import * as React from 'react'

export interface MainProps {}

export interface MainState {}

export default class Main extends React.Component<MainProps, MainState> {
	constructor(props: MainProps) {
		super(props)
		this.state = {
			activeProject: null,
			savedScrollOffset: -1
		}
	}

	componentDidMount() {
		document.title = 're:Imagine'
	}

	render() {
		return <div className="reimagine">test</div>
	}
}

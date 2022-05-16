import {
	socket
} from "./index.js"
export class community_search extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			status: "",
		}
	}

	componentWillUnmount() {
		clearInterval(this.state.queueInterval)
	}

	render() {
		return React.createElement('div', {
				className: "ranked",
			},
			React.createElement(
				"div", {},
				React.createElement("article", {}, React.createElement("b", {}, 'search player profile')),
			),
		)
	}
}
import {
	community_leaderboard
} from "./community_leaderboard.js"
import {
	community_spectate
} from "./community_spectate.js"
import {
	socket
} from "./index.js"
export class community extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			content: "leaderboard"
		}
		this.statechange_content = this.statechange_content.bind(this)
		this.statechange_content_spectate = this.statechange_content_spectate.bind(this)
		this.statechange_content_leaderboard = this.statechange_content_leaderboard.bind(this)
	}
	statechange_content() {
		if (this.state.content === "spectate")
			this.setState({
				content: "leaderboard"
			})
		else
			this.setState({
				content: "spectate"
			})
	}

	statechange_content_leaderboard() {
		if (this.state.content != "leaderboard")
			this.setState({
				content: "leaderboard"
			})
	}

	statechange_content_spectate() {
		if (this.state.content != "spectate")
			this.setState({
				content: "spectate"
			})
	}

	componentWillUnmount() {

	}

	render() {
		var index = 0
		var components = []
		if (this.state.content === "spectate") {
			components.push(React.createElement(community_spectate, {
				active_rooms: this.props.active_rooms,
				key: index++,
			}))
		}
		if (this.state.content === "leaderboard") {
			components.push(React.createElement(community_leaderboard, {
				key: index++,
				leaderboard: this.props.leaderboard
			}))
		}
		return React.createElement('div', {
				className: "Account",
			},
			this.props.username ? React.createElement("article", {}, '\u00A0') : "",
			React.createElement("article", {}, React.createElement("b", {}, 'community')),

			React.createElement("input", {
				style: {
					width: "17px",
					height: "17px"
				},
				type: "radio",
				name: "account",
				checked: this.state.content === "leaderboard",
				onChange: this.statechange_content
			}, ),
			React.createElement("label", {
				type: "radio",
				name: "leaderboard",
				onClick: this.statechange_content_leaderboard
			}, "leaderboard"),

			"\u00A0\u00A0\u00A0",

			React.createElement("input", {
				style: {
					width: "17px",
					height: "17px"
				},
				type: "radio",
				name: "community",
				checked: this.state.content === "spectate",
				onChange: this.statechange_content
			}, ),
			React.createElement("label", {
				type: "radio",
				name: "spectate",
				onClick: this.statechange_content_spectate
			}, "spectate"),

			React.createElement("div", {}, "\u00A0"),
			components
		)
	}
}
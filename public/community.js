import {
	community_leaderboard
} from "./community_leaderboard.js"
import {
	community_spectate
} from "./community_spectate.js"
import {
	community_search
} from "./community_search.js"
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
		this.statechange_content_search = this.statechange_content_search.bind(this)
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

	statechange_content_search(){
		if (this.state.content != "search")
		this.setState({
			content: "search"
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
		if (this.state.content === "search") {
			components.push(React.createElement(community_search, {
				key: index++,
				start_offline_game: this.props.start_offline_game,
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
				name: "community",
				checked: this.state.content === "leaderboard",
				onChange: this.statechange_content_leaderboard
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
				onChange: this.statechange_content_spectate
			}, ),
			React.createElement("label", {
				type: "radio",
				name: "spectate",
				onClick: this.statechange_content_spectate
			}, "spectate"),
			
			"\u00A0\u00A0\u00A0",

			React.createElement("input", {
				style: {
					width: "17px",
					height: "17px"
				},
				type: "radio",
				name: "community",
				checked: this.state.content === "search",
				onChange: this.statechange_content_search
			}, ),
			React.createElement("label", {
				type: "radio",
				name: "spectate",
				onClick: this.statechange_content_search
			}, "search"),

			React.createElement("div", {}, "\u00A0"),
			components
		)
	}
}
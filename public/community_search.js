import {
	socket
} from "./index.js"
import {
	profile
} from "./profile.js"
export class community_search extends React.Component {
	constructor(props) {
		super(props)
		this.state = {}
		this.state.user = {},
		this.state.history = []
		this.state.found = false
		socket.on("player_search_response", (user, history) => {
			if(user)
				this.setState({found : true}, ()=> {
					this.setState({
						user : user,
						history : history.games,
					})
				})
			else 
				this.setState({found : false})
		})
	}

	componentWillUnmount() {
		socket.off("player_search_response")
	}

	render() {
		return React.createElement('div', {
				className: "ranked",
			},
			React.createElement(
				"div", {},
				React.createElement("article", {}, React.createElement("b", {}, 'search player profile')),
			),
			React.createElement("div", {
				style: {
					fontSize: "10%"
				}
			}, "\u00A0"),
			React.createElement("input", {type :"text", onChange : (e) => {this.setState({search_input : e.target.value })}}, ), 
			"\u00A0",
			React.createElement("input", {onClick : () => socket.emit("community_search_player", this.state.search_input), type : "button", value : "search"}),
			React.createElement("div", {
				style: {
					fontSize: "100%"
				}
			}, "\u00A0"),
			this.state.found ? React.createElement(profile, {
				user : this.state.user,
				history: this.state.history,
				start_offline_game: this.props.start_offline_game,
			}) : ""
		)
	}
}
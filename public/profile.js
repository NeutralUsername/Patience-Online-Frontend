import {
	socket
} from "./index.js"
export class profile extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			status: "",
		}
	}

	componentWillUnmount() {
		socket.off("queued_up")
		socket.emit("leave_queue")
		clearInterval(this.state.queueInterval)
	}

	render() {
		return React.createElement('div', {
				className: "ranked",
			},
			React.createElement(
				"div", {},
				React.createElement("article", {}, React.createElement("b", {}, 'profile')),
			),
			this.props.player ? React.createElement("a", {
				style: {
					fontSize: "80%"
				},
				href: "",
				onClick: e => {
					e.preventDefault()
					this.props.statechange_content("change_password")
				}
			}, "change password") : "",
			React.createElement("article", {}, '\u00A0'),
			React.createElement("article", {}, React.createElement("b",{},this.props.user.username)),
			React.createElement("article", {}, 'elo rating : '+this.props.user.elo),
			React.createElement("article", {}, 'ranked wins : '+this.props.user.wins),
			React.createElement("article", {}, 'ranked losses : '+this.props.user.losses),
			React.createElement("article", {}, 'joined : '+new Date(this.props.user.created)),
			React.createElement("div", {style :{overflow : "auto"} },
				React.createElement('ul', {
					className: "history"
				}, this.props.history ? this.props.history.map((game, index) => {
					var result = game.PON.substring(game.PON.indexOf("=") + 1, game.PON.length)
					var player_color = game.r === this.props.username ? "red" : "black"
					return React.createElement("li", {
							key: index,
						}, React.createElement('u', {}, game.r === this.props.user.username ? ("vs. " + (game.b ? game.b : "guest")) : (" vs. " + (game.r ? game.r : "guest"))),
				
						React.createElement("b", {}, (result[0] === "r" && player_color === "red" || result[0] === "b" && player_color === "black") ? "\u00A0win" : result[0] === "d" ? "\u00A0draw " : "\u00A0loss"),
						React.createElement("i", {}, "\u00A0" + game.started, ),
						"\u00A0",
						React.createElement('button', {
							onClick: () => this.props.start_offline_game(game.PON, {
								username: game.r,
								elo: game.re
							}, {
								username: game.b,
								elo: game.be
							}),
							style: {
								cursor: "pointer"
							}
						}, "analyze"), React.createElement("div", {
							style: {
								fontSize: "10%"
							}
						}, "\u00A0"), )
				}) : "")
			)
		)
	}
}
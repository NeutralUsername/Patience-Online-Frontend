import { game } from "./game.js"
import {
	socket
} from "./index.js"

export class account_history extends React.Component {
	constructor(props) {
		super(props)
	}

	render() {
		return React.createElement('div', {
				className: "account_history",
			},
			React.createElement("article", {}, React.createElement("b", {}, 'games history')),
			React.createElement("div", {
				style: {
					fontSize: "10%"
				}
			}, "\u00A0"),

			React.createElement(history, {
				history: this.props.history,
				username: this.props.username,
				start_analysis_board : this.props.start_analysis_board
			}),
		)
	}
}

function history(props) {
	return (
		React.createElement('ul', {
			className: "history"
		}, props.history.map((history, index) => {
			var player_color = history.game.r === props.username ?"red" :"black"
			return React.createElement("li", {
					key: index,
				}, React.createElement('u', {},history.game.r === props.username ? ("vs. " + (history.game.b ? history.game.b : "guest")) : (" vs. " + (history.game.r ? history.game.r : "guest"))),
					React.createElement("b", {}, (history.game.c[0] === "r" && player_color === "red" || history.game.c[0] === "b" && player_color === "black") ? "\u00A0win" : history.game.c[0] === "d" ? "\u00A0draw " : "\u00A0loss"),
					React.createElement("i", {}, "\u00A0"+ history.game.started,),
					"\u00A0",
			 	  React.createElement('button', {
					onClick: () => props.start_analysis_board(history),
						style: {
							cursor: "pointer"
						}
				}, "analyze"), React.createElement("div", {
					style: {
						fontSize: "10%"
					}
				}, "\u00A0"), )
		}))
	)
}
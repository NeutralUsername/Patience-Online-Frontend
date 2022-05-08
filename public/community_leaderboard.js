import {
	socket
} from "./index.js"

export class community_leaderboard extends React.Component {
	constructor(props) {
		super(props)
	}

	componentWillUnmount() {}

	render() {
		var components = []
		var index = 0
		if (this.props.leaderboard)
			for (var user of this.props.leaderboard) {
				components.push(
					React.createElement("tr", {
							key: index++
						},
						React.createElement("td", {
							key: index++
						}, user.username),
						React.createElement("td", {
							key: index++
						}, user.elo),
					)
				)
			}

		return React.createElement('div', {
				className: "normal",
			},
			React.createElement("article", {}, React.createElement("b", {}, 'ranked leaderboard')),
			React.createElement("div", {
				style: {
					fontSize: "10%"
				}
			}, "\u00A0"),
			React.createElement("table", {},
				React.createElement("tbody", {},
					React.createElement("tr", {},
						React.createElement("th", {}, "name"),
						React.createElement("th", {}, "elo")
					),
					components
				),
			),
		)
	}
}
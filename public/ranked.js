import {
	socket
} from "./index.js"
export class ranked extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			status: "",
		}
		socket.on("queued_up", () => {
			this.setState({
				status: "."
			})
			this.setState({
				queueInterval: setInterval(() => {
					this.setState({
						status: this.state.status.length < 5 ? this.state.status + "." : "."
					})
				}, 1000)
			})
		})
		socket.on("disconnect", () => {
			socket.off("queued_up")
			clearInterval(this.state.queueInterval)
		})
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
				React.createElement("article", {}, React.createElement("b", {}, 'ranked games ')),
				!this.props.username ? React.createElement("article", {
						style: {
							fontSize: "100%"
						}
					},
					React.createElement("i", {}, "account required")) : "\u00A0",
				!this.props.username ? React.createElement("article", {}, '\u00A0') : "",
				React.createElement("article", {}, 'time control: fixed time'),
				React.createElement("article", {}, 'time : 90 seconds'),
				React.createElement("article", {}, 'moves counter : 5'),
				React.createElement("article", {}, 'malus : 16'),
				React.createElement("article", {}, 'tableau : 5'),
				React.createElement("article", {}, '\u00A0'),
			),
			React.createElement('button', {
				style: {
					fontSize: "130%"
				},
				onClick: () => {
					if (this.props.username)
						socket.emit('ranked_queue', {
							cookie: document.cookie
						})
					else
						this.setState({
							status: "account required"
						})
				}
			}, "queue up"),
			React.createElement('i', {}, "\u00A0\u00A0" + this.state.status)
		)
	}
}
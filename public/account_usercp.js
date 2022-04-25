import {
	socket
} from "./index.js"
import {
	account_change_password
} from "./account_change_password.js";

export class account_usercp extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			status: "",
			content  : "usercp"
		}
		socket.on("password_change_response", (data) => {
			console.log("test")
		})
		socket.on("admincp_data", (data) => {
			console.log(data)
		})
		this.statechange_content = this.statechange_content.bind(this)
	}

	componentWillUnmount() {
		socket.off("password_change_response")
		socket.off("admincp_data")
	}

	statechange_content (content) {
		this.setState({content : content})
	}

	render() {
		var components = []
		var index = 0
		if(this.state.content === "usercp") {
			components.push(
				React.createElement("a", {
					key : index++,
					style: {
						fontSize: "90%"
					},
					href: "",
					onClick: e => {
						e.preventDefault()
						this.setState({content : "change_password"})
					}
				}, "change password"),
			)
		}
		if(this.state.content === "change_password") {
			components.push(
				React.createElement("article", {
					key: index++,
				}),
				React.createElement("article", {
					key: index++,
				}, React.createElement(account_change_password, {
					statechange_content : this.statechange_content,
					key: index++,
				}, 'account')),
			)
		}

		return React.createElement('div', {
				className: "usercp",
			},
			React.createElement(
				"div", {},
			),
			components,
			this.props.username === "Charade" ? React.createElement("div", {}, "\u00A0") : "",
			this.props.username === "Charade" ? React.createElement('button', {
				style: {
					fontSize: "100%"
				},
				onClick: () => {
					socket.emit('admincp_requestdata')
				}
			}, "request data") : "",
		)
	}
}
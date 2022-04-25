import {
	socket
} from "./index.js"
import {
	SHA256
} from "./SHA256.js"

export class link_change_password extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			repeat_password: "",
			password: "",
			status: "",
		}
		this.statechange_repeat_password = this.statechange_repeat_password.bind(this)
		this.statechange_password = this.statechange_password.bind(this)
		socket.on("link_change_password_response", () => {
			this.setState({
				status: "password changed"
			})
			document.location.reload()
		})
	}
	statechange_repeat_password(repeat_password) {
		this.setState({
			repeat_password: repeat_password
		})
	}
	statechange_password(password) {
		this.setState({
			password: password
		})
	}
	componentWillUnmount() {
		socket.off("link_change_password_response")
	}

	render() {
		return React.createElement('form', {
				onSubmit: e => {
					e.preventDefault()
					if (this.state.password.length < 5 || this.state.password.length > 64 || !(/^[A-Za-z0-9]+$/.test(this.state.password))) {
						this.setState({
							status: "incorrect password format"
						})
						return
					}

					if (this.state.repeat_password.length === 0 || this.state.repeat_password != this.state.password) {
						this.setState({
							status: "password and confirmation must match"
						})
						return
					}
					socket.emit('link_change_password', { // socket emit <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< 
						password: SHA256(this.state.password),
					})
					this.setState({
						status: "..."
					})
				},
				className: "link_change_password",
			},
			React.createElement("article", {}, React.createElement("b", {}, 'password reset')), React.createElement("a", {
				style: {
					fontSize: "90%"
				},
				href: "",
				onClick: e => {
					e.preventDefault()
					this.props.statechange_content("usercp")
				}
			}, "back"),
			React.createElement("article", {}, '\u00A0'),
			React.createElement(
				password, {
					details: this.state,
					statechange: this.statechange_password
				}),
			React.createElement(
				repeat_password, {
					details: this.state,
					statechange: this.statechange_repeat_password
				}),
			React.createElement('input', {
				style: {
					fontSize: "100%"
				},
				type: "submit",
				value: "login"
			}),
			React.createElement('label', {}, "\u00A0\u00A0" + this.state.status)
		)
	}
}

function repeat_password(props) {
	return React.createElement('div', {
			className: "repeat_password"
		},
		React.createElement('span', null, "confirm password: "),
		React.createElement('input', {
			type: "password",
			value: props.details.repeat_password,
			onChange: event => props.statechange(event.target.value)
		}),
	)
}

function password(props) {
	return React.createElement('div', {
			className: "password"
		},
		React.createElement('span', null, "password: "),
		React.createElement('input', {
			type: "password",
			value: props.details.password,
			onChange: event => props.statechange(event.target.value)
		}),
	)
}
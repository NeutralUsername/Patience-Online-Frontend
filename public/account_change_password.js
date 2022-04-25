import {
	socket
} from "./index.js"
import {
	SHA256
} from "./SHA256.js"

export class account_change_password extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			current_password: "",
			repeat_password: "",
			password: "",
			status: "",
		}
		this.statechange_repeat_password = this.statechange_repeat_password.bind(this)
		this.statechange_current_password = this.statechange_current_password.bind(this)
		this.statechange_password = this.statechange_password.bind(this)
		socket.on("account_change_password_response", () => {
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

	statechange_current_password(current_password) {
		this.setState({
			current_password: current_password
		})
	}
	statechange_password(password) {
		this.setState({
			password: password
		})
	}
	componentWillUnmount() {
		socket.off("account_change_password_response")
	}

	render() {
		return React.createElement('form', {
				onSubmit: e => {
					e.preventDefault()

					if (this.state.current_password.length < 5 || this.state.current_password.length > 64 || !(/^[A-Za-z0-9]+$/.test(this.state.current_password))) {
						this.setState({
							status: "incorrect current password format"
						})
						return
					}

					if (this.state.password.length < 5 || this.state.password.length > 64 || !(/^[A-Za-z0-9]+$/.test(this.state.password))) {
						this.setState({
							status: "incorrect new password format"
						})
						return
					}

					if (this.state.repeat_password.length === 0 || this.state.repeat_password != this.state.password) {
						this.setState({
							status: "new password and confirmation must match"
						})
						return
					}
					socket.emit('account_change_password', { // socket emit <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< 
						current_password: SHA256(this.state.current_password),
						new_password: SHA256(this.state.password),
					})
					this.setState({
						status: "..."
					})
				},
				className: "account_change_password",
			},
			React.createElement("article", {}, React.createElement("b", {}, 'change password')),
			React.createElement("a", {
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
				current_password, {
					details: this.state,
					statechange: this.statechange_current_password
				}),
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
				value: "change"
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
		React.createElement('span', null, "new password: "),
		React.createElement('input', {
			type: "password",
			value: props.details.password,
			onChange: event => props.statechange(event.target.value)
		}),
	)
}

function current_password(props) {
	return React.createElement('div', {
			className: "current_password"
		},
		React.createElement('span', null, "current password: "),
		React.createElement('input', {
			type: "password",
			value: props.details.current_password,
			onChange: event => props.statechange(event.target.value)
		}),
	)
}


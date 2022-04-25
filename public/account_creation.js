import {
	socket
} from "./index.js"
import {
	SHA256
} from "./SHA256.js"

export class account_creation extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			username: "",
			password: "",
			password_confirmation: "",
			email: "",
			userlevel: 1,
			status_create: "",
			status_password: "",
			status_password_confirmation: "",
			status_username: "",
			status_email: "",
		}
		this.statechange_username = this.statechange_username.bind(this)
		this.statechange_password = this.statechange_password.bind(this)
		this.statechange_password_confirmation = this.statechange_password_confirmation.bind(this)
		this.statechange_email = this.statechange_email.bind(this)
		this.statechange_userlevel = this.statechange_userlevel.bind(this)
		socket.on("server_account_response", data => {
			if (data.username) {
				document.cookie = "username=" + data.username + ";"
				document.cookie = "password=" + data.password + ";"
				this.setState({
					status_create: "success"
				})
				location.reload()
			} else
				this.setState({
					status_create: "Username or Email already in use"
				})

		})
	}
	statechange_username(username) {
		this.setState({
			username: username
		})
	}
	statechange_password(password) {
		this.setState({
			password: password
		})
	}
	statechange_password_confirmation(password_confirmation) {
		this.setState({
			password_confirmation: password_confirmation
		})
	}
	statechange_email(email) {
		this.setState({
			email: email
		})
	}
	statechange_userlevel(userlevel) {
		this.setState({
			userlevel: userlevel
		})
	}

	componentWillUnmount() {
		socket.off("server_account_response")
	}

	render() {
		return React.createElement('form', {
				onSubmit: e => {
					e.preventDefault()
					var check = true
					if (this.state.username.length < 5 || this.state.username.length > 20 || !(/^[A-Za-z0-9]+$/.test(this.state.username))) {
						this.setState({
							status_username: "incorrect username format"
						})
						check = false
					}

					if (this.state.password.length < 5 || this.state.password.length > 64 || !(/^[A-Za-z0-9]+$/.test(this.state.password))) {
						this.setState({
							status_password: "incorrect password format"
						})
						check = false
					}

					if (this.state.password_confirmation.length === 0 || this.state.password_confirmation != this.state.password) {
						this.setState({
							status_password_confirmation: "password and confirmation must match"
						})
						check = false
					}

					if (this.state.email.length < 8 || this.state.email.length > 50 || !(/^[\w._-]+[+]?[\w._-]+@[\w.-]+\.[a-zA-Z]{2,6}$/.test(this.state.email))) {
						this.setState({
							status_email: "incorrect email format"
						})
						check = false
					}

					if (check === false) return
					this.setState({
						status_username: ""
					})
					this.setState({
						status_password: ""
					})
					this.setState({
						status_password_confirmation: ""
					})
					this.setState({
						status_email: ""
					})
					socket.emit('client_create_account', { // socket emit <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
						username: this.state.username,
						password: SHA256(this.state.password),
						email: this.state.email,
					})
					this.setState({
						status_create: "...."
					})
				},
				className: "Account",
			},
			React.createElement("article", {}, React.createElement("b", {}, 'register')),
			React.createElement("div", {}, "\u00A0"),
			React.createElement(
				username, {
					details: this.state,
					statechange: this.statechange_username
				}),
			React.createElement(
				password, {
					details: this.state,
					statechange: this.statechange_password
				}),
			React.createElement(
				password_confirmation, {
					details: this.state,
					statechange: this.statechange_password_confirmation
				}),
			React.createElement(
				email, {
					details: this.state,
					statechange: this.statechange_email
				}),
			React.createElement('input', {
				type: "submit",
				value: "create"
			}),
			React.createElement('label', {}, "\u00A0\u00A0" + this.state.status_create)
		)
	}
}

function username(props) {
	return React.createElement('div', {
			className: "username"
		},
		React.createElement('span', null, "username: "),
		React.createElement('input', {
			type: "text",
			value: props.details.username,
			onChange: event => props.statechange(event.target.value)
		}),
		React.createElement('label', {}, "\u00A0\u00A0" + props.details.status_username),
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
		React.createElement('label', {}, "\u00A0\u00A0" + props.details.status_password),
	)
}

function password_confirmation(props) {
	return React.createElement('div', {
			className: "password_confirmation"
		},
		React.createElement('span', null, "confirm password: "),
		React.createElement('input', {
			type: "password",
			value: props.details.password_confirmation,
			onChange: event => props.statechange(event.target.value)
		}),
		React.createElement('label', {}, "\u00A0\u00A0" + props.details.status_password_confirmation),
	)
}

function email(props) {
	return React.createElement('div', {
			className: "email"
		},
		React.createElement('span', null, "email: "),
		React.createElement('input', {
			type: "email",
			value: props.details.email,
			onChange: event => props.statechange(event.target.value)
		}),
		React.createElement('label', {}, "\u00A0\u00A0" + props.details.status_email),
	)
}
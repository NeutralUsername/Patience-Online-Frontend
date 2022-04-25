import {
	socket
} from "./index.js"
import {
	SHA256
} from "./SHA256.js"
import {
	account_forgot_password
} from "./account_forgot_password.js"
export class account_login extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			username: "",
			password: "",
			remember: false,
			status: "",
			status_login: "",
			status_password: "",
			status_login_button: "",
			forgot_password: false,
		}
		this.statechange_username = this.statechange_username.bind(this)
		this.statechange_password = this.statechange_password.bind(this)
		this.statechange_remember = this.statechange_remember.bind(this)
		socket.on("server_login_response", login_response => {
			if (login_response.username) {
				if (this.state.remember) {
					var a = new Date();
					a = new Date(a.getTime() + 10 * (1000 * 60 * 60 * 24 * 365));
					document.cookie = "username=" + login_response.username + "; expires=" + a.toUTCString() + ';';
					document.cookie = "password=" + login_response.password + "; expires=" + a.toUTCString() + ';';
				} else {
					document.cookie = "username=" + login_response.username
					document.cookie = "password=" + login_response.password
				}
				this.setState({
					status_login_button: "success"
				})
				location.reload()
			} else this.setState({
				status_login_button: "unknown credentials"
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
	statechange_remember(remember) {

		if (remember != undefined)
			this.setState({
				remember: remember
			})
		else
			this.setState({
				remember: !this.state.remember
			})
	}
	componentWillUnmount() {
		socket.off("server_login_response")
	}

	render() {
		if (!this.state.forgot_password)
			return React.createElement('form', {
					onSubmit: e => {
						e.preventDefault()
						var check = true
						if (this.state.username.length < 5 || this.state.username.length > 20 || !(/^[A-Za-z0-9]+$/.test(this.state.username))) {
							check = false
						}
						if (this.state.password.length < 5 || this.state.password.length > 20 || !(/^[A-Za-z0-9]+$/.test(this.state.password))) {
							check = false
						}
						if (check === false) return
						socket.emit('client_login_account', { // socket emit <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< 
							username: this.state.username,
							password: SHA256(this.state.password),
						})
						this.setState({
							status_login_button: "...."
						})
					},
					className: "Account",
				},
				React.createElement("article", {}, React.createElement("b", {}, 'login')),
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
					remember, {
						details: this.state,
						statechange: this.statechange_remember
					}),
				React.createElement('input', {
					style: {
						fontSize: "100%"
					},
					type: "submit",
					value: "login"
				}), "\u00A0\u00A0\u00A0\u00A0",
				React.createElement("a", {
					style: {
						fontSize: "80%"
					},
					href: "",
					onClick: e => {
						e.preventDefault()
						this.setState({
							forgot_password: true
						})
					}
				}, "forgot password?"),
				React.createElement('label', {}, "\u00A0\u00A0" + this.state.status_login_button)
			)
		else
			return React.createElement(account_forgot_password, {}, "")
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

function remember(props) {
	return React.createElement('div', {
			className: "remember"
		},
		React.createElement('span', {
			onClick: e => {
				e.preventDefault()
				props.statechange()
			}
		}, "remember? "),
		React.createElement('input', {
			style: {
				width: "17px",
				height: "17px"
			},
			type: "checkbox",
			checked: props.details.remember,
			onChange: event => props.statechange()
		}),
	)
}
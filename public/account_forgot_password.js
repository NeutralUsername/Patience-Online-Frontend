import {
	socket
} from "./index.js"
import {
	account_login
} from "./account_login.js";
export class account_forgot_password extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			email: "",
			status: "",
			forgot_password: true,
		}
		this.statechange_email = this.statechange_email.bind(this)
		socket.on("forgot_password_response", forgot_password_response => {
			this.setState({
				status: forgot_password_response ? "link sent" : "incorrent credentials"
			})
		})
	}
	statechange_email(email) {
		this.setState({
			email: email
		})
	}

	componentWillUnmount() {
		socket.off("forgot_password_response")
	}

	render() {
		if (this.state.forgot_password)
			return React.createElement('form', {
					onSubmit: e => {
						e.preventDefault()
						if (!(this.state.email.length < 8 || this.state.email.length > 50 || !(/^[\w._-]+[+]?[\w._-]+@[\w.-]+\.[a-zA-Z]{2,6}$/.test(this.state.email)))) {
							socket.emit('client_forgot_password', { // socket emit <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< 
								email: this.state.email,
							})
							this.setState({
								status: "...."
							})
						} else
							this.setState({
								status: "invalid input"
							})
					},
					className: "forgot_password",
				},
				React.createElement(
					email, {
						details: this.state,
						statechange: this.statechange_email
					}),
				React.createElement('input', {
					style: {
						fontSize: "100%"
					},
					type: "submit",
					value: "send reset link"
				}),
				"\u00A0\u00A0\u00A0\u00A0",
				React.createElement("a", {
					style: {
						fontSize: "80%"
					},
					href: "",
					onClick: e => {
						e.preventDefault()
						this.setState({
							forgot_password: false
						})
					}
				}, "enter password"),
				React.createElement('label', {}, "\u00A0\u00A0" + this.state.status)
			)
		else
			return React.createElement(account_login)
	}
}

function email(props) {
	return React.createElement('div', {
			className: "email"
		},
		React.createElement('span', null, "email: "),
		React.createElement('input', {
			type: "text",
			value: props.details.email,
			onChange: event => props.statechange(event.target.value)
		}),
	)
}
import {
	socket
} from "./index.js"
import {
	account_creation
} from "./account_creation.js";
import {
	account_login
} from "./account_login.js";
import {
	account_usercp
} from "./account_usercp.js";
import {
	account_history
} from "./account_history.js"
export class account extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			content: !this.props.username ? "login" : "history"
		}
		this.statechange_content = this.statechange_content.bind(this)
		this.statechange_content_login = this.statechange_content_login.bind(this)
		this.statechange_content_usercp = this.statechange_content_usercp.bind(this)
		this.statechange_content_create = this.statechange_content_create.bind(this)
		this.statechange_content_refactorpls = this.statechange_content_refactorpls.bind(this)
		this.statechange_content_history = this.statechange_content_history.bind(this)
	}
	statechange_content() {
		if (!this.props.username)
			if (this.state.content === "login")
				this.setState({
					content: "create"
				})
		else
			this.setState({
				content: "login"
			})
		else {
			if (this.state.content != "usercp")
				this.setState({
					content: "usercp"
				})
		}
	}

	statechange_content_login() {
		this.setState({
			content: "login"
		})
	}

	statechange_content_create() {
		this.setState({
			content: "create"
		})
	}

	statechange_content_usercp() {
		this.setState({
			content: "usercp"
		})
	}

	statechange_content_history() {
		this.setState({
			content: "history"
		})
	}

	statechange_content_refactorpls(content) {
		this.setState({
			content: content
		})
	}

	componentWillUnmount() {
		socket.off("server_login_response")
	}

	render() {
		var index = 0
		var componets = []
		if (!this.props.username) {
			componets.push(
				React.createElement("article", {
					key: index++,
				}, React.createElement("b", {
					key: index++,
				}, 'account')),
				React.createElement("input", {
					key: index++,
					style: {
						width: "17px",
						height: "17px"
					},
					type: "radio",
					name: "account",
					checked: this.state.content === "login",
					onChange: this.statechange_content
				}, ),
				React.createElement("label", {
					key: index++,
					type: "radio",
					name: "login",
					onClick: this.statechange_content_login
				}, "login"),
				"\u00A0\u00A0\u00A0",
				React.createElement("input", {
					key: index++,
					style: {
						width: "17px",
						height: "17px"
					},
					type: "radio",
					name: "account",
					checked: this.state.content === "create",
					onChange: this.statechange_content
				}, ),
				React.createElement("label", {
					key: index++,
					type: "radio",
					name: "login",
					onClick: this.statechange_content_create
				}, "new account"),
				React.createElement("div", {
					key: index++,
				}, "\u00A0"),
			)
			if (this.state.content === "login")
				componets.push(React.createElement(account_login, {
					key: index++
				}, ))
			else
				componets.push(React.createElement(account_creation, {
					key: index++
				}, ))
		}

		if (this.props.username) {
			componets.push(
				React.createElement("article", {
					key: index++,
				}, React.createElement("b", {
					key: index++,
				}, 'account')),
				
				React.createElement("input", {
					key: index++,
					style: {
						width: "17px",
						height: "17px"
					},
					type: "radio",
					name: "account",
					checked: this.state.content === "history",
					onChange: this.statechange_content
				}, ),
				React.createElement("label", {
					key: index++,
					type: "radio",
					name: "login",
					onClick: this.statechange_content_history
				}, "history"),
				"\u00A0\u00A0\u00A0",
				React.createElement("input", {
					key: index++,
					style: {
						width: "17px",
						height: "17px"
					},
					type: "radio",
					name: "account",
					checked: this.state.content === "usercp",
					onChange: this.statechange_content
				}, ),
				React.createElement("label", {
					key: index++,
					type: "radio",
					name: "login",
					onClick: this.statechange_content_usercp
				}, "usercp"),

				React.createElement("div", {
					key: index++,
				}, "\u00A0"),
			)
			if (this.state.content === "usercp")
				componets.push(React.createElement(account_usercp, {
					key: index++,
					username: this.props.username,
					statechange_content: this.statechange_content_refactorpls
				}, ))

			if (this.state.content === "history")
			componets.push(React.createElement(account_history, {
				key: index++,
				username: this.props.username,
				history : this.props.history,
				start_analysis_board : this.props.start_analysis_board
			}, ))
			
		}
		return React.createElement('div', {
				className: "Account",
			},
			componets
		)
	}
}
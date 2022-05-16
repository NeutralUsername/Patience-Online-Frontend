import {
	socket
} from "./index.js"
export class menu_bar extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			status: ""
		}
		socket.on("disconnect", () => {
			this.setState({
				status: "...disconnected..."
			})
		})
		socket.on("connect", () => {
			this.setState({
				status: ""
			})
		})
	}
	render() {
		var components = []
		var index = 0
		if (this.props.content != "link_change_password") {
			if (this.props.content != "game") {
				components.push(React.createElement('button', {
					style: {
						fontSize: "130%"
					},
					key: index++,
					onClick: () => this.props.statechange_content("casual"),
				}, "casual"))
				components.push("\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0")

				components.push(React.createElement('button', {
					style: {
						fontSize: "130%"
					},
					key: index++,
					onClick: () => this.props.statechange_content("ranked"),
				}, "ranked"))
				components.push("\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0")

				components.push(React.createElement("button", {
					style: {
						fontSize: "110%"
					},
					key: index++,
					onClick: () => this.props.statechange_content("community"),
				}, "community"))
				components.push("\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0")

				if (!this.props.username) {
					components.push(React.createElement('button', {
						style: {
							fontSize: "90%"
						},
						key: index++,
						onClick: () => this.props.statechange_content("login"),
					}, "login"))
					components.push("\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0")
	
					components.push(React.createElement('button', {
						style: {
							fontSize: "90%"
						},
						key: index++,
						onClick: () => this.props.statechange_content("create_account"),
					}, "create account"))
					components.push("\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0")
				}
				if (this.props.username ) {
					components.push(React.createElement('button', {
						style: {
							fontSize: "90%"
						},
						key: index++,
						onClick: () => this.props.statechange_content("player_profile"),
					}, "profile"))
					components.push("\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0")
	
					components.push(React.createElement('button', {
						style: {
							fontSize: "100%"
						},
						key: index++,
						onClick: () => this.props.logout_click(),
						style: {},
					}, "logout"))
				}
			}
		}
		if (this.props.content != "game" && this.props.content != "sandbox")
			components.push((React.createElement("a", {
				key: index++,
				href: "https://discord.gg/xaPkZ6EmAe"
			}, React.createElement("img", {
				key: index++,
				style: {
					position: "fixed",
					top: "4%",
					right: "4%",
					width: "4%"
				},
				src: "https://img.icons8.com/fluency/344/discord-logo.png"
			}))), )
		return (
			React.createElement('div', {
					className: "menu_bar",
					style: {
						position: "absolute",
					}
				},
				components,
				"\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0" + this.state.status
			)
		)
	}
}
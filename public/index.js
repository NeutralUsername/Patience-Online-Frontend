import {
	game
} from "./game.js";
import {
	tutorial
} from "./tutorial.js";
import {
	casual
} from "./casual.js";
import {
	ranked
} from "./ranked.js";
import {
	link_change_password
} from "./link_change_password.js"
import {
	community
} from "./community.js"
import {
	menu_bar
} from "./menu_bar.js"
import {
	login
} from "./login.js"
import {
	create_account
} from "./create_account.js"
import {
	profile
} from "./profile.js"
import {
	change_password
} from "./change_password.js";

window.location.hostname.includes("www.") ? window.location.replace('https://patienceonline.com/') : ""
export const socket = io();

function changeFontSize(element) {
	var currentSize = window.getComputedStyle(element, null).getPropertyValue('font-size');
	if (currentSize) {
		currentSize = parseFloat(currentSize.replace("px", ""));
		element.style.fontSize = "140%";
		for (var i = 0; i < element.children.length; i++) {
			changeFontSize(element.children[i]);
		}
	}
}
changeFontSize(document.body);

socket.on("connect", () => {
	if (!cookiesEnabled()) {
		socket.disconnect(true)
		document.body.style = 'background: black;';
		return
	}
	document.cookie = "socketid=" + socket.id + ";"
	document.body.style = 'background: #dbd9d7;';
})

socket.on("guest_login", (data) => {
	console.log("guest login")
	if (data.content != "game")
		document.cookie = "active_game=;"
	document.cookie = "username=;"
	document.cookie = "password=;"
	ReactDOM.render(
		React.createElement("div"), document.getElementById('root')
	)
	ReactDOM.render(
		React.createElement(Index, data), document.getElementById('root')
	)
})

socket.on("user_login", (data) => {
	console.log("user_login")

	if (data.content != "game")
		document.cookie = "active_game=;"
	ReactDOM.render(
		React.createElement("div"), document.getElementById('root')
	)
	ReactDOM.render(
		React.createElement(Index, data), document.getElementById('root')
	)
})

export class Index extends React.Component {
	constructor(props) {
		super(props)
		this.state = JSON.parse(JSON.stringify(this.props))
		socket.on("server_update_pendingrooms", (data) => {
			if(data.pending_rooms.length > 1)
				data.pending_rooms.reverse()
			this. setState(data)
		})
		socket.on("server_update_activerooms", (data) => {
			this.setState(data)
		})
		socket.on("server_update_leaderboard", (data) => {
			this.setState({
				leaderboard: data
			})
		})
		socket.on("server_update_history", (data) => {
			console.log(data)
			if(data.games) {
				var history = []
				if (data != false)
					for (var game of data.games) {
						history.push(game)
					}
				this.setState({
					history: history
				})
			}
			else if(data) {
				if(this.state.history)
					this.state.history.reverse()
				else
					this.state.history = []
				this.state.history.push(data)
				this.state.history.reverse()
				}
		})
		socket.on("server_update_elo", (data) => {
			console.log(data)
			var u = this.state.user
			u.elo = data
			this.setState({user : u})
		})

		socket.on("start_game", (data) => {
			console.log("starting game")
			if (!this.props.user && !data.spectator) {
				var a = new Date();
				a = new Date(a.getTime() + 10 * (1000 * 60 * 60 * 24 * 365));
				document.cookie = "active_game=" + socket.id + "; expires=" + a.toUTCString() + ';';
			}
			this.setState({
				content: "game",
				game_PON: data.game_PON + data.actions_PON,
				color: data.color,
				black: data.black,
				red: data.red,
				last_action: data.last_action,
				spectator: data.spectator ? true : false,
				offline: false
			})
		})

		this.menubar_logout_click = this.menubar_logout_click.bind(this)
		this.statechange_content = this.statechange_content.bind(this)
		this.end_offline_game = this.end_offline_game.bind(this)
		this.start_offline_game = this.start_offline_game.bind(this)
	}

	componentWillUnmount() {
		socket.off("user_login")
		socket.off("guest_login")
		socket.off("start_game")
		socket.off("server_game_end")
		socket.off("logout_successful")
	}

	componentDidMount() {
		socket.emit("client_request_history")
	}

	start_offline_game(gamePON, red, black, color) {
		this.setState({
			red: red,
			black: black,
			content: "game",
			game_PON: gamePON,
			color: color,
			offline: true,
		})
	}

	end_offline_game() {
		this.setState({
			red: {},
			black: {},
			game_PON: "",
			color: "",
			content: "casual",
			offline: false,
		})
	}

	menubar_logout_click() {
		if (confirm("do you really want to logout?")) {
			document.cookie = "username=;"
			document.cookie = "password=;"
			location.reload()
		}
	}

	statechange_content(content) {
		this.setState({
			content: content
		})
	}

	render() {
		var components = []
		var index = 0
		if (this.state.content === "link_change_password")
			components.push(
				React.createElement(link_change_password, {
					id: "link_change_password",
					key: index++,
				})
			)
		if (this.state.content === "casual")
			components.push(
				React.createElement(casual, {
					id: "casual",
					key: index++,
					name: shuffle(socket.id.split("")).join(""), //lobby default value
					secret: "",
					time: 1800,
					increment: 0,
					moves_counter: 5,
					malus_size: 16,
					tableau_size: 5,
					color: "red",
					mode: "unranked",
					time_control: "increment",
					game_pon: "",
					pending_rooms: this.state.pending_rooms,
					username: this.props.user.username,
					elo: this.props.user.elo,
					start_offline_game: this.start_offline_game,
					statechange_content: this.statechange_content,
				})
			)
		if (this.state.content === "rules")
			components.push(
				React.createElement(tutorial, {
					id: "rules",
					key: index++,
					statechange_content: this.statechange_content
				})
			)
		if (this.state.content === "community")
			components.push(
				React.createElement(community, {
					id: "community",
					key: index++,
					active_rooms: this.state.active_rooms,
					leaderboard: this.state.leaderboard
				})
			)
		if (this.state.content === "ranked")
			components.push(
				React.createElement(ranked, {
					username: this.props.user.username,
					id: "ranked",
					key: index++,
				})
			)
		if (this.state.content === "game") {
			components.push(
				React.createElement(game, {
					key: index++,
					black: this.state.black,
					red: this.state.red,
					game_PON: this.state.game_PON,
					color: this.state.color,
					timer_red: this.state.timer_red,
					timer_black: this.state.timer_black,
					last_action: this.state.last_action,
					spectator: this.state.spectator,
					offline: this.state.offline,
					end_offline_game: this.end_offline_game,
				})
			)
		}
		if (this.state.content === "login")
			components.push(
				React.createElement(login, {
					key: index++,
				})
			)
		if (this.state.content === "create_account")
		components.push(
			React.createElement(create_account, {
				key: index++,
			})
		)
		if (this.state.content === "player_profile")
			components.push(
				React.createElement(profile, {
					key: index++,
					user : this.state.user,
					player : true,
					history: this.state.history,
					start_offline_game: this.start_offline_game,
					statechange_content: this.statechange_content,
				})
			)
		if (this.state.content === "profile")
			components.push(
				React.createElement(profile, {
					key: index++,
					user : this.state.profile_user,
					player : false,
					history: this.state.profile_history,
					start_offline_game: this.start_offline_game,
					statechange_content: this.statechange_content,
				})
			)
		if (this.state.content === "change_password")
			components.push(
				React.createElement(change_password, {
					key: index++,
					user : this.state.user,
					player : false,
					statechange_content: this.statechange_content
				})
			)
		return React.createElement('div', {
				onContextMenu: e => {
					e.preventDefault()
				},
				style: {
					position: "absolute",
					width: this.state.content != "game" ? "90%" : "100%",
					height: this.state.content != "game" ? "90%" : "100%",
					top: (this.state.content === "game" || this.state.content === "analysis_board" ? "0%" : "4%"),
					left: (this.state.content === "game" || this.state.content === "analysis_board" ? "0%" : "4%")
				},
				className: "Index",
			},
			React.createElement(menu_bar, {
				username: this.props.user.username,
				elo: this.state.elo,
				content: this.state.content,
				statechange_content: this.statechange_content,
				logout_click: this.menubar_logout_click,
			}),
			React.createElement("div", {
					style: {
						position: "absolute",
						top: "3.5vmax",
					}
				},
				(this.props.user.username && this.state.content != "game") ? React.createElement("i", {onClick : () => this.statechange_content("player_profile"), style : {cursor : "pointer"}}, "signed in as ", React.createElement("b", {}, this.props.user.username)) : "",
				(this.state.user.elo && this.state.content != "game") ? React.createElement("div", {onClick : () => this.statechange_content("player_profile"), style : {cursor : "pointer"}}, React.createElement("i", {}, "rating:  ", React.createElement("b", {}, this.state.user.elo))) : "",
				(this.state.user.elo && this.state.content != "game") ? React.createElement("div", {}, "\u00A0") : "",
			),
			React.createElement("div", {
				style: {
					position: "absolute",
					top: this.state.content != "game" ? this.props.user.username ? "7vmax" : "3.5vmax" : "",
					zoom: this.state.content === "game" ? "98%" : "",
				}
			}, components)
		)
	}
}

function shuffle(array) {
	var currentIndex = array.length,
		randomIndex;
	while (0 !== currentIndex) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;
		[array[currentIndex], array[randomIndex]] = [
			array[randomIndex], array[currentIndex]
		];
	}
	return array;
}

function cookiesEnabled() {
	var i, j, cookies, found;
	if (navigator.cookieEnabled === false) return 0;
	document.cookie = 'testcookiesenabled=1';
	for (i = 0; i < 2; i++) {
		found = false;
		cookies = document.cookie.split(';');
		j = cookies.length;
		while (j--) {
			while (cookies[j].charAt(0) == ' ') { // trim spaces
				cookies[j] = cookies[j].substring(1);
			}
			if (cookies[j].indexOf('testcookiesenabled=') == 0) {
				found = true;
				break;
			}
		}
		if (!found) {
			return i;
		}
		// Delete test cookie.
		document.cookie = 'testcookiesenabled=; expires=Thu, 01 Jan 1970 00:00:01 GMT';
	}
	// Results inconclusive.
}

function getCookie(n) {
	let a = `; ${document.cookie}`.match(`;\\s*${n}=([^;]+)`);
	return a ? a[1] : '';
}
document.onselectstart = new Function ("return false")
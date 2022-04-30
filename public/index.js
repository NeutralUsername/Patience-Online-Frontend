import {
	game
} from "./game.js";
import {
	tutorial
} from "./tutorial.js";
import {
	normal
} from "./normal.js";
import {
	ranked
} from "./ranked.js";
import {
	account
} from "./account.js"
import {
	link_change_password
} from "./link_change_password.js"
import {
	community
} from "./community.js"
import {
	menu_bar
} from "./menu_bar.js"

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
			this.setState(data)
		})
		socket.on("server_update_activerooms", (data) => {
			this.setState(data)
		})
		socket.on("server_update_leaderboard", (data) => {
			this.setState({leaderboard : data})
		})
		socket.on("server_update_history", (data) => {
			console.log(data)
			var history  = []
			if(data != false)
				for(var game of data.games) {
					var actions = data.actions.filter(a=>a.id === game.id)
					if(actions.length=== 0)
						actions.push({ap : ""})
					history.push({game : game, actions : actions[0].ap})
				}
				this.setState({history : history})
		})

		socket.on("start_game", (data) => {
			console.log("starting game")
			if (!this.props.username && !data.spectator) {
				var a = new Date();
				a = new Date(a.getTime() + 10 * (1000 * 60 * 60 * 24 * 365));
				document.cookie = "active_game=" + socket.id + "; expires=" + a.toUTCString() + ';';
			}
			this.setState({
				content : "game",
				game_PON : data.game_PON,
				actions_PON : data.actions_PON,
				color : data.color,
				black :data.black,
				red : data.red,
				last_action : data.last_action,
				spectator: data.spectator ? true : false,
			})
		})
		socket.on("server_game_end", (data) => {
			if (data.outcome != "spectator_leave") {
				alert("winner: " + data.outcome.winner + "\nevent: " + data.outcome.event)
				if (data.outcome[this.state.color + "elo"]) {
					this.setState({
						elo: data.outcome[this.state.color + "elo"]
					})
				}
			}
			this.setState({
				red : {},
				black: {},
				game_PON : "",
				acton_action : "",
				timer_black : 0,
				timer_red : 0,
				color : "",
				content: "normal",
			})
			if(data.replay) {
				console.log(data.replay.game.PON+"["+data.replay.actions+"]"+"="+data.replay.game.c)
				if(this.props.username) {
					this.state.history.reverse()
					this.state.history.push({game : data.replay.game , actions : data.replay.actions})
					this.state.history.reverse()
				}
			}
		})

		this.menubar_logout_click = this.menubar_logout_click.bind(this)
		this.statechange_content = this.statechange_content.bind(this)
		this.start_analysis_board = this.start_analysis_board.bind(this)
		this.end_analysis_board = this.end_analysis_board.bind(this)
	}

	componentWillUnmount() {
		socket.off("user_login")
		socket.off("guest_login")
		socket.off("start_game")
		socket.off("server_game_end")
		socket.off("logout_successful")
	}

	componentDidMount() {
		socket.emit("update_history")
	}

	end_analysis_board(){
		this.setState({
			red : {},
			black: {},
			game_PON : "",
			actions_PON : "",
			color : "",
			content: "account",
			analysis_board : false,
		})
	}

	start_analysis_board(history) {
		var actions_PON  = history.actions
		this.setState({
			red : {
				username : history.game.r != null ? history.game.r : "",
				elo :  history.game.re != null ? history.game.re : "",
			},
			black : {
				username : history.game.b != null ? history.game.b : "",
				elo :  history.game.be != null ? history.game.be : "",
			},
			content : "game",
			game_PON : history.game.PON,
			actions_PON : actions_PON,
			color : history.game.r === this.props.username ? "red" : "black",
			turn : history.game.r === this.props.username ? "red" : "black",
			analysis_board :  true,
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
		if (this.state.content === "normal")
			components.push(
				React.createElement(normal, {
					id: "normal",
					key: index++,
					name: shuffle(socket.id.split("")).join(""), //lobby default value
					secret: "",
					time: 1500,
					increment: 0,
					moves_counter: 5,
					malus_size: 16,
					tableau_size: 5,
					mode : "normal",
					time_control : "increment",
					pending_rooms: this.state.pending_rooms,
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
					leaderboard : this.state.leaderboard
				})
			)
		if (this.state.content === "ranked")
			components.push(
				React.createElement(ranked, {
					username: this.props.username,
					id: "ranked",
					key: index++,
				})
			)
		if (this.state.content === "admincp")
			components.push(
				React.createElement(admincp, {
					id: "admincp",
					key: index++,
				})
			)
		if (this.state.content === "game") {
			components.push(
				React.createElement(game, {
					key: index++,
					spectator: this.state.spectator ,
					analysis_board : this.state.analysis_board ,
					black :this.state.black,
					red : this.state.red,
					game_PON : this.state.game_PON,
					actions_PON : this.state.actions_PON,
					color : this.state.color,
					timer_red : this.state.timer_red,
					timer_black : this.state.timer_black,
					last_action  : this.state.last_action,
					end_analysis_board : this.end_analysis_board,
				})
			)
		}
		if (this.state.content === "account")
			components.push(
				React.createElement(account, {
					username: this.props.username,
					key: index++,
					history : this.state.history,
					start_analysis_board : this.start_analysis_board
				})
			)
		return React.createElement('div', {
			onContextMenu : e=> {
				e.preventDefault()
			},
				style: {
					overflow : ('ontouchstart' in document.documentElement && /mobi/i.test(navigator.userAgent)) ? "" :  "hidden",
					position: "absolute",
					width: "100%",
					height : "100%",
					top: (this.state.content === "game" || this.state.content === "analysis_board" ? "0%" : "4%"),
					left: (this.state.content === "game" || this.state.content === "analysis_board"  ? "0%" : "4%")
				},
				className: "Index",
			},
			React.createElement(menu_bar, {
				username: this.props.username,
				elo: this.state.elo,
				content: this.state.content,
				statechange_content: this.statechange_content,
				logout_click: this.menubar_logout_click,
			}),
			React.createElement("div", {
				style : {
					position : "absolute",
					top : "3.5vmax",
				}
			}, 
				(this.props.username &&this.state.content != "game" ) ? React.createElement("i", {}, "signed in as ", React.createElement("b", {}, this.props.username)) : "",
				(this.state.elo &&  this.state.content != "game" ) ? React.createElement("div", {}, React.createElement("i", {}, "elo:  ", React.createElement("b", {}, this.state.elo))) : "",
				( this.state.elo &&this.state.content != "game") ? React.createElement("div", {}, "\u00A0") : "",
			),
			React.createElement("div", {
				style : {
					position : "absolute",
					top : this.state.content != "game" ? this.props.username ? "7vmax" :  "3.5vmax" : "",
					zoom : this.state.content === "game" ?  "98%" : "",
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

function disableselect(e) {
  return false
}

function reEnable() {
  return true
}

document.onselectstart = new Function ("return false")

if (window.sidebar) {
  document.onmousedown = disableselect
  document.onclick = reEnable
}

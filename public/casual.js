import {
	socket
} from "./index.js"
import {
	PON_from_game
} from "./PON.js"
import {
	game
} from "./game.js"
export class casual extends React.Component {
	constructor(props) {
		super(props)
		this.state = JSON.parse(JSON.stringify(this.props))
		this.state.last_game_pon = ""
		this.state.visible = true
		this.state.game_pon = PON_from_game(game_from_settings(this.state))
		this.statechange_name = this.statechange_name.bind(this)
		this.statechange_secret = this.statechange_secret.bind(this)
		this.statechange_time = this.statechange_time.bind(this)
		this.statechange_increment = this.statechange_increment.bind(this)
		this.statechange_malus_size = this.statechange_malus_size.bind(this)
		this.statechange_tableau_size = this.statechange_tableau_size.bind(this)
		this.statechange_moves_counter = this.statechange_moves_counter.bind(this)
		this.statechange_color = this.statechange_color.bind (this)
		this.statechange_mode = this.statechange_mode.bind(this)
		this.statechange_game_pon = this.statechange_game_pon.bind(this)
		this.statechange_last_game_pon = this.statechange_last_game_pon.bind(this)
		this.new_click = this.new_click.bind(this)
		this.statechange = this.statechange.bind(this)
	}

	new_click() {
		if (this.state.name && this.state.name.length > 5) {
			if (!this.state.mode.includes("solo") && !this.state.mode.includes("ai")) {
				socket.emit('client_newroom', {
					cookie: document.cookie,
					roomdata: {
						name: this.state.name,
						secret: this.state.secret,
						time: this.state.time > 0 ? Number(this.state.time) : 1,
						increment:this.state.increment,
						mode: this.state.mode,
						moves_counter: this.state.moves_counter,
						malus_size: Number(this.state.malus_size),
						tableau_size: Number(this.state.tableau_size),
						game_pon: this.state.last_game_pon,
						initial_game_pon : this.state.game_pon,
					},
					color : this.state.color,
				})
			} else {
				this.props.start_offline_game(
					this.state.game_pon, 
					{
						username: this.props.username ? this.props.username : "",
						elo: this.props.elo ? this.props.elo : ""
					}, 
					{
						username: this.state.mode.includes("ai") ? "AI" : "",
						elo: ""
					}, 
					this.state.color ? this.state.color : "red")
			}
		}
	}
	statechange_last_game_pon(last_game_pon) {
		this.setState({
			last_game_pon: last_game_pon
		})
	}

	statechange_color(color) {
		this.setState({
			color : color,
			visible : false,
		}, () => {
			this.setState({
				game_pon: this.state.game_pon,
			}, () => {
				this.setState({visible:true})
			})
		})
	}

	statechange_name(name) {
		if (name.length < 30)
			this.setState({
				name: name
			})
	}
	statechange_secret(secret) {
		if (secret.length < 30)
			this.setState({
				secret: secret
			})
	}
	statechange_moves_counter(moves_counter) {
		if (moves_counter.length < 30)
			this.setState({
				moves_counter: moves_counter,
				visible : false,
			}, () => {
				this.setState({
					game_pon: PON_from_game(game_from_settings(this.state)),
				}, () => {
					this.setState({visible:true})
				})
			})
	}
	statechange_time(time) {
		this.setState({
			time: time,
			visible : false,
		}, () => {
			this.setState({
				game_pon: PON_from_game(game_from_settings(this.state)),
			}, () => {
				this.setState({visible:true})
			})
		})
	}
	statechange_increment(increment) {
		this.setState({
			increment: increment,
			visible : false,
		}, () => {
			this.setState({
				game_pon: PON_from_game(game_from_settings(this.state)),
			}, () => {
				this.setState({visible:true})
			})
		})
	}
	statechange_malus_size(malus_size) {
		this.setState({
			malus_size: malus_size,
			visible : false,
		}, () => {
			this.setState({
				game_pon: PON_from_game(game_from_settings(this.state)),
			}, () => {
				this.setState({visible:true})
			})
		})
	}
	statechange_tableau_size(tableau_size) {
		this.setState({
			tableau_size: tableau_size,
			visible : false,
		}, () => {
			this.setState({
				game_pon: PON_from_game(game_from_settings(this.state)),
			}, () => {
				this.setState({visible:true})
			})
		})
	}
	statechange_mode(mode) {
		if(mode === this.state.mode)
			this.setState({
				mode: mode,
				visible : false,
				color : this.state.color 
			}, () => {
				this.setState({
					game_pon: PON_from_game(game_from_settings(this.state)),
				}, () => {
					this.setState({visible:true})
				})
			})
		else
			this.setState({
				mode: mode,
				color : this.state.mode === "solo" ? "red" : mode === "solo" ? "" : this.state.color,
				visible : mode === "solo" ? false : true,
			}, () => {
				if(mode === "solo")
					this.setState({
						game_pon: this.state.game_pon,
					}, () => {
						this.setState({visible:true})
					})
			})
	}
	statechange(state, color) {
		console.log(state)
		var statecopy = {
			...state
		}
		statecopy.secret = ""
		this.setState(statecopy, () => {
			this.setState({
				visible : false,
				color : color
			}, () => {
				this.setState({
					game_pon: state.game_pon,
				}, () => {
					this.setState({visible:true})
				})
			})
		})
	}

	statechange_game_pon(game_pon) {
		this.setState({
			visible:false,
		}, () => {
			this.setState({
				game_pon: game_pon
			}, () => {
				this.setState({visible:true})
			})
		})
	}

	componentDidMount() {
		this.setState({
			mounted: true
		})
	}

	componentWillUnmount() {
		this.setState({
			mounted: false
		})
	}

	render() {
		return React.createElement('div', {
				className: "casual",
			},
			React.createElement("article", {}, React.createElement("b", {}, 'casual games')),
			this.state.mounted ? React.createElement("div", {
					style: {
						zoom: "43%",
						position: "absolute",
						left: document.getElementById("clipboardpastebutton").getBoundingClientRect().right * 2,
						top : "8.5vmax"
					}
				},
				this.state.visible?React.createElement(game, {
					black: {
						username: ""
					},
					red: {
						username: ""
					},
					color: this.state.color ? this.state.color : "red",
					game_PON: this.state.game_pon,
					timer_red: this.state.time,
					timer_black: this.state.time,
					offline: true,
					preview: true,
					statechange_last_game_pon: this.statechange_last_game_pon
				}, ) : ""
			) : "",
			React.createElement("a", {
				style: {
					fontSize: "80%"
				},
				href: "",
				onClick: e => {
					e.preventDefault()
					this.props.statechange_content("rules")
				}
			}, "tutorial"),
			React.createElement("article", {}, '\u00A0'),
			React.createElement(
				name, {
					details: this.state,
					statechange: this.statechange_name
				}, ),
			React.createElement("div", {
				style: {
					fontSize: "50%"
				}
			}, "\u00A0"),
			React.createElement(secret, {
				details: this.state,
				statechange: this.statechange_secret
			}, ),
			React.createElement("div", {
				style: {
					fontSize: "50%"
				}
			}, "\u00A0"),
			React.createElement(color, {
				details: this.state,
				statechange_color: this.statechange_color
			}, ),
			React.createElement("div", {
				style: {
					fontSize: "50%"
				},
			}, "\u00A0"),
			React.createElement(increment, {
				time: this.state.time,
				increment: this.state.increment,
				statechange_time: this.statechange_time,
				statechange_increment: this.statechange_increment,
			}, ) ,
			React.createElement("div", {
				style: {
					fontSize: "50%"
				}
			}, "\u00A0"),
			React.createElement(moves_counter, {
				statechange: this.statechange_moves_counter,
				details: this.state.moves_counter

			}, ),
			React.createElement("div", {
				style: {
					fontSize: "50%"
				}
			}, "\u00A0"),
			React.createElement(malus, {
				details: this.state.malus_size,
				statechange: this.statechange_malus_size
			}, ),
			React.createElement("div", {
				style: {
					fontSize: "50%"
				}
			}, "\u00A0"),
			React.createElement(tableau, {
				details: this.state.tableau_size,
				statechange: this.statechange_tableau_size
			}, ),
			React.createElement("div", {
				style: {
					fontSize: "50%"
				}
			}, "\u00A0"),
			React.createElement(mode, {
				mode: this.state.mode,
				statechange_mode: this.statechange_mode
			}, ),
			React.createElement("div", {
				style: {
					fontSize: "50%"
				},
			}, "\u00A0"),

			React.createElement(game_pon, {
				statechange: this.statechange_game_pon,
				details: this.state.game_pon,
			}, ),
			React.createElement("div", {
				style: {
					fontSize: "50%"
				},
			}, "\u00A0"),



			React.createElement("div", {},
				React.createElement('button', {
					style: {
						fontSize: "150%"
					},
					onClick: () => this.new_click()
				}, (this.state.mode === "unranked" ? "create lobby" : "start game")),
			),

			React.createElement(pending_rooms, {
				pending_rooms: this.props.pending_rooms,
				statechange: this.statechange
			}),
			React.createElement("div", {
				style: {
					fontSize: "1000%"
				}
			}, "\u00A0"),
		)
	}
}


function game_pon(props) {
	return React.createElement('div', {
			className: "game_pon"
		},
		React.createElement('span', null, "game pon: "),
		React.createElement('input', {
			style: {
				width: "360px",
				fontSize: "100%"
			},
			type: "text",
			value: props.details,
			onChange: event => props.statechange(event.target.value)
		}),
		" ",
		React.createElement("button", {
			id: "clipboardpastebutton",
			style: {

			},
			onClick: async function() {
				props.statechange(await navigator.clipboard.readText())
			},
		}, "paste from clipboard"),
	)
}

function name(props) {
	return React.createElement('div', {
			className: "room_name",
			style : {zIndex : 1, position : "relative"}
		},
		React.createElement('span', null, "room name: "),
		React.createElement('input', {
			style: {
				width: "360px",
				fontSize: "100%"
			},
			disabled : props.details.mode != "unranked" ? true : false, 
			type: "text",
			value: props.details.name,
			onChange: event => props.statechange(event.target.value)
		}),
	)
}

function secret(props) {
	return React.createElement('div', {
			className: "room_secret"
		},
		React.createElement('span', null, "room password: "),
		React.createElement('input', {
			style: {
				fontSize: "100%",
				width: "280px"
			},
			disabled : props.details.mode != "unranked" ? true : false, 
			type: "password",
			value: props.details.secret,
			onChange: event => props.statechange(event.target.value)
		}),
	)
}

function increment(props) {
	return React.createElement('div', {
			className: "room_time"
		},
		React.createElement('label', {}, "time limit "),
		React.createElement('select', {
				style: {
					fontSize: "100%"
				},
				value: props.time,
				onChange: event => props.statechange_time(event.target.value)
			},
			React.createElement('option', {
				value: "3"
			}, "1min"),
			React.createElement('option', {
				value: "120"
			}, "2min"),
			React.createElement('option', {
				value: "180"
			}, "3min"),
			React.createElement('option', {
				value: "300"
			}, "5min"),
			React.createElement('option', {
				value: "600"
			}, "10min"),
			React.createElement('option', {
				value: "900"
			}, "15min"),
			React.createElement('option', {
				value: "1200"
			}, "20min"),
			React.createElement('option', {
				value: "1500"
			}, "25min"),
			React.createElement('option', {
				value: "1800"
			}, "30min"),
			React.createElement('option', {
				value: "2700"
			}, "45min"),
			React.createElement('option', {
				value: "3600"
			}, "1h"),
			React.createElement('option', {
				value: "7200"
			}, "2h"),
			React.createElement('option', {
				value: "10800"
			}, "3h"),
			React.createElement('option', {
				value: "86400"
			}, "24h"),
		),
		React.createElement('label', {}, "\u00A0\u00A0\u00A0\u00A0increment "),
		React.createElement('select', {
				style: {
					fontSize: "100%"
				},
				value: props.increment,
				onChange: event => props.statechange_increment(event.target.value)
			},
			React.createElement('option', {
				value: "0"
			}, "0sec"),
			React.createElement('option', {
				value: "1"
			}, "1sec"),
			React.createElement('option', {
				value: "2"
			}, "2sec"),
			React.createElement('option', {
				value: "3"
			}, "3sec"),
			React.createElement('option', {
				value: "4"
			}, "4sec"),
			React.createElement('option', {
				value: "5"
			}, "5sec"),
			React.createElement('option', {
				value: "6"
			}, "6sec"),
			React.createElement('option', {
				value: "7"
			}, "7sec"),
			React.createElement('option', {
				value: "8"
			}, "8sec"),
			React.createElement('option', {
				value: "9"
			}, "9sec"),
			React.createElement('option', {
				value: "10"
			}, "10sec"),
			React.createElement('option', {
				value: "15"
			}, "15sec"),
			React.createElement('option', {
				value: "20"
			}, "20sec"),
			React.createElement('option', {
				value: "30"
			}, "30sec"),
			React.createElement('option', {
				value: "45"
			}, "45sec"),
			React.createElement('option', {
				value: "60"
			}, "60sec"),
		),
	)
}

function malus(props) {
	return React.createElement('div', {
			className: "room_malus"
		},
		React.createElement('label', {}, "malus "),
		React.createElement('select', {
				style: {
					fontSize: "100%"
				},
				value: props.details,
				onChange: event => props.statechange(event.target.value)
			},
			React.createElement('option', {
				value: "5"
			}, "5"),
			React.createElement('option', {
				value: "6"
			}, "6"),
			React.createElement('option', {
				value: "7"
			}, "7"),
			React.createElement('option', {
				value: "8"
			}, "8"),
			React.createElement('option', {
				value: "9"
			}, "9"),
			React.createElement('option', {
				value: "10"
			}, "10"),
			React.createElement('option', {
				value: "11"
			}, "11"),
			React.createElement('option', {
				value: "12"
			}, "12"),
			React.createElement('option', {
				value: "13"
			}, "13"),
			React.createElement('option', {
				value: "14"
			}, "14"),
			React.createElement('option', {
				value: "15"
			}, "15"),
			React.createElement('option', {
				value: "16"
			}, "16"),
			React.createElement('option', {
				value: "17"
			}, "17"),
			React.createElement('option', {
				value: "18"
			}, "18"),
			React.createElement('option', {
				value: "19"
			}, "19"),
			React.createElement('option', {
				value: "20"
			}, "20"),
		),
	)
}

function tableau(props) {
	return React.createElement('div', {
			className: "room_tableau"
		},
		React.createElement('label', {}, "tableau "),
		React.createElement('select', {
				style: {
					fontSize: "100%"
				},
				value: props.details,
				onChange: event => props.statechange(event.target.value)
			},
			React.createElement('option', {
				value: "0"
			}, "0"),
			React.createElement('option', {
				value: "1"
			}, "1"),
			React.createElement('option', {
				value: "2"
			}, "2"),
			React.createElement('option', {
				value: "3"
			}, "3"),
			React.createElement('option', {
				value: "4"
			}, "4"),
			React.createElement('option', {
				value: "5"
			}, "5"),
			React.createElement('option', {
				value: "6"
			}, "6"),
			React.createElement('option', {
				value: "7"
			}, "7"),
			React.createElement('option', {
				value: "8"
			}, "8"),
		),
	)
}

function moves_counter(props) {
	return React.createElement('div', {
			className: "moves_counter"
		},
		React.createElement('label', {}, "moves counter "),
		React.createElement('select', {
				style: {
					fontSize: "100%"
				},
				value: props.details,
				onChange: event => props.statechange(event.target.value)
			},
			React.createElement('option', {
				value: "1"
			}, "1"),
			React.createElement('option', {
				value: "2"
			}, "2"),
			React.createElement('option', {
				value: "3"
			}, "3"),
			React.createElement('option', {
				value: "4"
			}, "4"),
			React.createElement('option', {
				value: "5"
			}, "5"),
			React.createElement('option', {
				value: "6"
			}, "6"),
			React.createElement('option', {
				value: "7"
			}, "7"),
			React.createElement('option', {
				value: "8"
			}, "8"),
			React.createElement('option', {
				value: "9"
			}, "9"),
			React.createElement('option', {
				value: "10"
			}, "10"),
			React.createElement('option', {
				value: "11"
			}, "11"),
			React.createElement('option', {
				value: "12"
			}, "12"),
			React.createElement('option', {
				value: "13"
			}, "13"),
			React.createElement('option', {
				value: "15"
			}, "15"),
			React.createElement('option', {
				value: "17"
			}, "17"),
			React.createElement('option', {
				value: "20"
			}, "20"),
			React.createElement('option', {
				value: "25"
			}, "25"),
			React.createElement('option', {
				value: "30"
			}, "30"),
		),
	)
}

function mode(props) {
	return React.createElement("div", {},
		React.createElement('label', {}, "mode:\u00A0\u00A0"),
		React.createElement('input', {
			style: {
				width: "15px",
				height: "15px"
			},
			name: "mode",
			type: "radio",
			id: "timed_checkbox",
			checked: props.mode === "unranked",
			onClick: () => {
				props.statechange_mode("unranked")
			},
			onChange: () => {}
		}),
		React.createElement('label', {
			onClick: () => {
				props.statechange_mode("unranked")
			},
		}, "vs. player\u00A0\u00A0"),
		React.createElement('input', {
			style: {
				width: "15px",
				height: "15px"
			},
			name: "mode",
			type: "radio",
			id: "timed_checkbox",
			checked: props.mode === "ai",
			onClick: () => {
				props.statechange_mode("ai")
			},
			onChange: () => {}
		}),
		React.createElement('label', {
			onClick: () => {
				props.statechange_mode("ai")
			},
		}, "vs. AI\u00A0\u00A0"),
		React.createElement('input', {
			style: {
				width: "15px",
				height: "15px"
			},
			name: "mode",
			type: "radio",
			id: "timed_checkbox",
			checked: props.mode === "solo",
			onClick: () => {
				props.statechange_mode("solo")
			},
			onChange: () => {}
		}),
		React.createElement('label', {
			onClick: () => {
				props.statechange_mode("solo")
			},
		}, "solo\u00A0\u00A0"),
	)
}

function color (props) {
	return React.createElement("div", {},
		React.createElement('label', {}, "color:\u00A0\u00A0"),
		React.createElement('input', {
			style: {
				width: "15px",
				height: "15px"
			},
			name: "color",
			type: "radio",
			id: "color_checkbox",
			disabled : props.details.mode === "solo" ? true : false,
			checked: props.details.color === "red",
			onClick: () => {
				props.statechange_color("red")
			},
			onChange: () => {}
		}),
		React.createElement('label', {
			onClick: () => {
				if(props.details.mode != "solo")
					props.statechange_color("red")
			},
		}, "red\u00A0\u00A0"),
		React.createElement('input', {
			style: {
				width: "15px",
				height: "15px"
			},
			name: "color",
			type: "radio",
			id: "color_checkbox",
			disabled : props.details.mode === "solo" ? true : false,
			checked: props.details.color === "black",
			onClick: () => {
				props.statechange_color("black")
			},
			onChange: () => {}
		}),
		React.createElement('label', {
			onClick: () => {
				if(props.details.mode != "solo")
					props.statechange_color("black")
			},
		}, "blue\u00A0\u00A0"),
	)
}


function pending_rooms(props) {
	function join_click(socketid, secret) {
		if (socketid != socket.id) {
			if (secret)
				socket.emit("client_join", {
					socketid: socketid,
					cookie: document.cookie,
					secret: prompt("Enter Room Password")
				})
			else
				socket.emit("client_join", {
					socketid: socketid,
					cookie: document.cookie
				})
		}
	}
	return (
		React.createElement('ul', {
			className: "pending_rooms"
		}, props.pending_rooms.map((room, index) => {
			return React.createElement("li", {
					key: index,
					style: {
						cursor: "pointer"
					},
				}, React.createElement('u', {
					onClick: () => props.statechange(room.settings, room.red_user ? "black" : "red")
				}, room.settings.name),
				room.settings.secret ? " 🔒" : " ",( room.red_user ?( room.red_user.initial_socketid != socket.id && room.red_user.socketid_cookie_on_reation != getCookie("socketid") ):  (room.black_user.initial_socketid != socket.id && room.black_user.socketid_cookie_on_reation != getCookie("socketid")))   ? React.createElement('button', {
					onClick: () => join_click(room.red_user ? room.red_user.initial_socketid :  room.black_user.initial_socketid, room.settings.secret),
					style: {
						cursor: "pointer"
					}
				}, "join room") : "", React.createElement("div", {
					style: {
						fontSize: "50%"
					}
				}, "\u00A0"), )
		}))
	)
}

function getCookie(n) {
	let a = `; ${document.cookie}`.match(`;\\s*${n}=([^;]+)`);
	return a ? a[1] : '';
}
function game_from_settings(settings) {
	var game = {
		redmalus: [],
		redstock: [],
		reddiscard: [],
		redreserve: [],
		redtableau0: [],
		redtableau1: [],
		redtableau2: [],
		redtableau3: [],
		redfoundation0: [],
		redfoundation1: [],
		redfoundation2: [],
		redfoundation3: [],
		blackmalus: [],
		blackstock: [],
		blackdiscard: [],
		blackreserve: [],
		blacktableau0: [],
		blacktableau1: [],
		blacktableau2: [],
		blacktableau3: [],
		blackfoundation0: [],
		blackfoundation1: [],
		blackfoundation2: [],
		blackfoundation3: [],
		moves_counter: settings.moves_counter,
		lowest_malus_red: settings.malus_size,
		lowest_malus_black: settings.malus_size,
		timer_red: settings.time,
		timer_black: settings.time,
		increment: settings.increment,
		turn_counter: 0,
	}
	var reddeck = shuffle(freshDeck("red"))
	for (var ms = 0; ms < settings.malus_size; ms++) {
		while (reddeck[reddeck.length - 1].value === 13 || reddeck[reddeck.length - 1].value === 1 || (ms < parseInt(settings.malus_size/2) && reddeck[reddeck.length - 1].value < 5)) {
			reddeck = shuffle(reddeck)
		}
		var card = reddeck.pop()
		game.redmalus.push(card)
		game.blackmalus.push(new Card("black", card.suit, card.value))
	}
	game.turn = "red"

	if(settings.tableau_size > 0) {
		var check = false
		do {
			for (var tableau_nr = 0; tableau_nr < 4; tableau_nr++)
				for (var ts = 0; ts < settings.tableau_size; ts++) {
					var card = reddeck.pop()
					game["redtableau" + tableau_nr].push(card)
					game["blacktableau" + tableau_nr].push(new Card("black", card.suit, card.value))
				}
				var counter = 0
				for(var i = 0; i < 4; i++)  {
					if(game["redtableau"+i][game["redtableau"+i].length-1].value === game.redmalus[game.redmalus.length-1].value)
						counter++
					if( game["redtableau"+i][game["redtableau"+i].length-1].value-1 === game.redmalus[game.redmalus.length-1].value || game["redtableau"+i][game["redtableau"+i].length-1].value+1 === game.redmalus[game.redmalus.length-1].value) {
						if(game["redtableau"+i][game["redtableau"+i].length-1].suit === game.redmalus[game.redmalus.length-1].suit)
							counter++
					}
					if( game["redtableau"+i][game["redtableau"+i].length-1].value-1 === game.redmalus[game.redmalus.length-1].value) {
						if(game["redtableau"+i][game["redtableau"+i].length-1].suit === "hearts" || game["redtableau"+i][game["redtableau"+i].length-1].suit === "diamonds")
							if(game.redmalus[game.redmalus.length-1].suit === "clubs" || game.redmalus[game.redmalus.length-1].suit === "spades")
								counter++
						if(game["redtableau"+i][game["redtableau"+i].length-1].suit === "clubs" || game["redtableau"+i][game["redtableau"+i].length-1].suit === "spades")
							if(game.redmalus[game.redmalus.length-1].suit === "hearts" || game.redmalus[game.redmalus.length-1].suit === "diamonds")
								counter++
					}
					if(game["redtableau"+i][game["redtableau"+i].length-1].value === 1)
						counter++
				}	
				if(settings.tableau_size > 1)
					for(var i = 0; i < 4; i++)  {
						if(game["redtableau"+i][game["redtableau"+i].length-2].value === game.redmalus[game.redmalus.length-1].value)
							counter++
						if( game["redtableau"+i][game["redtableau"+i].length-2].value-1 === game.redmalus[game.redmalus.length-1].value || game["redtableau"+i][game["redtableau"+i].length-2].value+1 === game.redmalus[game.redmalus.length-1].value) {
							if(game["redtableau"+i][game["redtableau"+i].length-2].suit === game.redmalus[game.redmalus.length-1].suit)
								counter++
						}
						if( game["redtableau"+i][game["redtableau"+i].length-2].value-1 === game.redmalus[game.redmalus.length-1].value) {
							if(game["redtableau"+i][game["redtableau"+i].length-2].suit === "hearts" || game["redtableau"+i][game["redtableau"+i].length-2].suit === "diamonds")
								if(game.redmalus[game.redmalus.length-1].suit === "clubs" || game.redmalus[game.redmalus.length-1].suit === "spades")
									counter++
							if(game["redtableau"+i][game["redtableau"+i].length-2].suit === "clubs" || game["redtableau"+i][game["redtableau"+i].length-2].suit === "spades")
								if(game.redmalus[game.redmalus.length-1].suit === "hearts" || game.redmalus[game.redmalus.length-1].suit === "diamonds")
									counter++
						}
						if(game["redtableau"+i][game["redtableau"+i].length-2].value === 1)
							counter++
					}	
				if(settings.tableau_size > 2)
					for(var i = 0; i < 4; i++)  {
						if(game["redtableau"+i][game["redtableau"+i].length-3].value === game.redmalus[game.redmalus.length-1].value)
							counter++
						if( game["redtableau"+i][game["redtableau"+i].length-3].value-1 === game.redmalus[game.redmalus.length-1].value || game["redtableau"+i][game["redtableau"+i].length-3].value+1 === game.redmalus[game.redmalus.length-1].value) {
							if(game["redtableau"+i][game["redtableau"+i].length-3].suit === game.redmalus[game.redmalus.length-1].suit)
								counter++
						}
						if( game["redtableau"+i][game["redtableau"+i].length-3].value-1 === game.redmalus[game.redmalus.length-1].value) {
							if(game["redtableau"+i][game["redtableau"+i].length-3].suit === "hearts" || game["redtableau"+i][game["redtableau"+i].length-3].suit === "diamonds")
								if(game.redmalus[game.redmalus.length-1].suit === "clubs" || game.redmalus[game.redmalus.length-1].suit === "spades")
									counter++
							if(game["redtableau"+i][game["redtableau"+i].length-3].suit === "clubs" || game["redtableau"+i][game["redtableau"+i].length-3].suit === "spades")
								if(game.redmalus[game.redmalus.length-1].suit === "hearts" || game.redmalus[game.redmalus.length-1].suit === "diamonds")
									counter++
						}
					}	
				if(counter === 0) {
					check = true
				}
				if(check && reddeck.length > 0)   {
					counter = 0
					if(reddeck[reddeck.length-1].value === game.redmalus[game.redmalus.length-1].value)
						counter++
					if( reddeck[reddeck.length-1].value-1 === game.redmalus[game.redmalus.length-1].value || reddeck[reddeck.length-1].value+1 === game.redmalus[game.redmalus.length-1].value) 
						if(reddeck[reddeck.length-1].suit === game.redmalus[game.redmalus.length-1].suit)
							counter++
					if(reddeck[reddeck.length-1].value === 1)
						counter++
		
					if(reddeck.length > 1) {
						if(reddeck[reddeck.length-2].value === game.redmalus[game.redmalus.length-1].value)
							counter++
						if( reddeck[reddeck.length-2].value-1 === game.redmalus[game.redmalus.length-1].value || reddeck[reddeck.length-2].value+1 === game.redmalus[game.redmalus.length-1].value) 
							if(reddeck[reddeck.length-2].suit === game.redmalus[game.redmalus.length-1].suit)
								counter++
						if(reddeck.length > 2) {
							if(reddeck[reddeck.length-3].value === game.redmalus[game.redmalus.length-1].value)
								counter++
							if( reddeck[reddeck.length-3].value-1 === game.redmalus[game.redmalus.length-1].value || reddeck[reddeck.length-3].value+1 === game.redmalus[game.redmalus.length-1].value) 
								if(reddeck[reddeck.length-3].suit === game.redmalus[game.redmalus.length-1].suit)
									counter++
						}
					}
					if(counter != 0) {
						check = false
					}
				}
				if(!check) {
					for(var p = 0; p < 2; p++)
						for(var i = 0; i < 4; i++)  
							for(var j = 0; j < settings.tableau_size; j++) {
								if(p === 0)
									reddeck.push(game["red" + "tableau"+i].pop())
								if(p === 1)
									game["black" + "tableau"+i].pop()
							}
					reddeck = shuffle(reddeck)
				}
		} while (!check)
	}
	game.redstock = reddeck
	for (var c of reddeck)
		game.blackstock.push(new Card("black", c.suit, c.value))
	return game
}

class Card {
	constructor(color, suit, value) {
		this.color = color;
		this.suit = suit;
		this.value = value;
		this.faceup = true;
	}
}

function freshDeck(color) {
	const suits = ["hearts", "diamonds", "spades", "clubs"];
	const values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
	return suits.flatMap(suit => {
		return values.map(value => {
			return new Card(color, suit, value)
		});
	});
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
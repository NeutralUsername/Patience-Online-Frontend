import {
	socket
} from "./index.js"
import {
	PON_from_game
} from "./PON.js"
export class normal extends React.Component {
	constructor(props) {
		super(props)
		this.state = JSON.parse(JSON.stringify(this.props))
		this.statechange_name = this.statechange_name.bind(this)
		this.statechange_secret = this.statechange_secret.bind(this)
		this.statechange_time = this.statechange_time.bind(this)
		this.statechange_increment = this.statechange_increment.bind(this)
		this.statechange_malus_size = this.statechange_malus_size.bind(this)
		this.statechange_tableau_size = this.statechange_tableau_size.bind(this)
		this.statechange_moves_counter = this.statechange_moves_counter.bind(this)
		this.statechange_throw_malus = this.statechange_throw_malus.bind(this)
		this.statechange_throw_discard = this.statechange_throw_discard.bind(this)
		this.statechange_time_control = this.statechange_time_control.bind(this)
		this.statechange_mode = this.statechange_mode.bind(this)
		this.statechange_game_pon = this.statechange_game_pon.bind(this)
		this.new_click = this.new_click.bind(this)
		this.statechange = this.statechange.bind(this)
	}

	new_click() {
		if (this.state.name && this.state.name.length > 5) {
			if(!this.state.mode.includes("custom") && !this.state.mode.includes("ai"))
				socket.emit('client_newroom', {
					cookie: document.cookie,
					roomdata: {
						name: this.state.name,
						secret: this.state.secret,
						time: this.state.time > 0 ? Number(this.state.time) : 1,
						time_control : this.state.time_control.includes( "increment") ? (this.state.time_control+this.state.increment) : this.state.time_control,
						mode : this.state.mode,
						moves_counter : this.state.moves_counter,
						malus_size: Number(this.state.malus_size),
						tableau_size: Number(this.state.tableau_size),
						throw_malus: this.state.throw_malus,
						throw_discard: this.state.throw_discard,
					}
				})
			else {
				if(this.state.mode.includes("custom") ){
					this.props.start_offline_game(this.state.game_pon, { username : this.props.username ? this.props.username : "", elo : this.props.elo ? this.props.elo : ""}, { username : "" , elo : ""})
				}
				if(this.state.mode.includes("ai") ){
					this.props.start_offline_game(this.state.game_pon, { username : this.props.username ? this.props.username : "", elo : this.props.elo ? this.props.elo : ""}, { username : "AI" , elo : ""})
				}
			 }	
		}	
	}
	statechange_time_control(time_control) {
		if(time_control === "hourglass")
			this.state.time = 90
		if(time_control === "increment")
			this.state.time = 60*25
		if(time_control === "fixed_time")
			this.state.time = 60
			this.setState({
				time_control: time_control
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
				moves_counter: moves_counter
			})
	}
	statechange_time(time) {
		this.setState({
			time: time
		})
	}
	statechange_increment(increment) {
		if (increment[increment.length - 1] >= 0 || increment[increment.length - 1] <= 9) {
			if (increment <= 120)
				this.setState({
					increment: increment
				})
			else
				this.setState({
					increment: 120
				})
		}
		if (increment === "")
			this.setState({
				increment: ""
			})
	}
	statechange_malus_size(malus_size) {
		this.setState({
			malus_size: malus_size
		})
	}
	statechange_tableau_size(tableau_size) {
		this.setState({
			tableau_size: tableau_size
		})
	}
	statechange_throw_malus() {
		this.setState({
			throw_malus: !this.state.throw_malus
		})
	}
	statechange_mode(mode) {
		if(mode === "custom" || mode === "ai")
			this.setState({game_pon : PON_from_game(game_from_settings(this.state))})
		this.setState({
			mode: mode
		})
	}
	statechange_throw_discard() {
		this.setState({
			throw_discard: !this.state.throw_discard
		})
	}
	statechange(state) {
		var statecopy = {
			...state
		}
		statecopy.secret = ""
		this.setState(statecopy)
	}

	statechange_game_pon(game_pon) {
		this.setState({game_pon : game_pon})
	}

	render() {
		return React.createElement('div', {
				className: "normal",
			},
			React.createElement("article", {}, React.createElement("b", {}, 'normal games')),
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
					details: this.state.name,
					statechange: this.statechange_name
				}, ),
			React.createElement("div", {
				style: {
					fontSize: "50%"
				}
			}, "\u00A0"),
			React.createElement(secret, {
				details: this.state.secret,
				statechange: this.statechange_secret
			}, ),
			React.createElement("div", {
				style: {
					fontSize: "50%"
				}
			}, "\u00A0"),
			React.createElement(time_control, {
				time_control: this.state.time_control,
				statechange: this.statechange_time_control
			}, ),
			React.createElement("div", {
				style: {
					fontSize: "50%"
				}
			}, "\u00A0"),
			this.state.time_control === "increment" ? React.createElement(increment, {
				time: this.state.time,
				increment : this.state.increment,
				statechange_time: this.statechange_time,
				statechange_increment: this.statechange_increment,
			}, ) : "",
			this.state.time_control === "hourglass" ? React.createElement(hourglass, {
				details: this.state.time,
				statechange: this.statechange_time
			}, ) : "",
			this.state.time_control === "fixed_time" ? React.createElement(fixed_time, {
				details: this.state.time,
				statechange: this.statechange_time
			}, ) : "",
			React.createElement("div", {
				style: {
					fontSize: "50%"
				}
			}, "\u00A0"),
			React.createElement(moves_counter, {
				statechange: this.statechange_moves_counter,
				details : this.state.moves_counter

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
				mode : this.state.mode,
				statechange_mode :this.statechange_mode
			},),
			React.createElement("div", {
				style: {
					fontSize: "50%"
				},
			}, "\u00A0"),


			this.state.mode === "custom" ? React.createElement(game_pon, {
				statechange: this.statechange_game_pon,
				details : this.state.game_pon,
			},) : "",
			this.state.mode === "custom" ? React.createElement("div", {
				style: {
					fontSize: "50%"
				},
			}, "\u00A0") : "",



			React.createElement("div", {},
				React.createElement('button', {
					style: {
						fontSize: "150%"
					},
					onClick: () => this.new_click()
				}, (this.state.mode === "normal" ?"create room" : "start game")),
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
		style: {

		},
		onClick: async function () {
			props.statechange(	await navigator.clipboard.readText())
		},
	}, "paste from clipboard"),
	)
}

function name(props) {
	return React.createElement('div', {
			className: "room_name"
		},
		React.createElement('span', null, "name: "),
		React.createElement('input', {
			style: {
				width: "360px",
				fontSize: "100%"
			},
			type: "text",
			value: props.details,
			onChange: event => props.statechange(event.target.value)
		}),
	)
}

function secret(props) {
	return React.createElement('div', {
			className: "room_secret"
		},
		React.createElement('span', null, "secret: "),
		React.createElement('input', {
			style: {
				fontSize: "100%",
				width: "280px"
			},
			type: "password",
			value: props.details,
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
				value: "60"
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
				value: "1"
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

function time_control (props) {


	return React.createElement("div", {}, 
		React.createElement('label', {}, "time control: "),
		React.createElement('input', {style : {width: "15px",height: "15px"},type : "radio", name : "time_control", value : "hourglass", checked  : props.time_control === "hourglass", onChange : () => props.statechange("hourglass")}),
		React.createElement('label', {onClick : () => props.statechange("hourglass")}, "hourglass\u00A0\u00A0"),
		React.createElement('input', {style : {width: "15px",height: "15px"},type : "radio", name : "time_control", value : "increment", checked  : props.time_control === "increment", onChange : () => props.statechange("increment")}),
		React.createElement('label', {onClick : () => props.statechange("increment")}, "increment\u00A0\u00A0"),
		React.createElement('input', {style : {width: "15px",height: "15px"},type : "radio", name : "time_control", value : "fixed_time", checked  : props.time_control === "fixed_time", onChange : () => props.statechange("fixed_time")}),
		React.createElement('label', {onClick : () => props.statechange("fixed_time")}, "fixed time\u00A0\u00A0"),
	)
}

function fixed_time (props) {
	return React.createElement("div", {}, 
		React.createElement('label', {}, "time per turn "),
		React.createElement('select', {
				style: {
					fontSize: "100%"
				},
				value: props.details,
				onChange: event => props.statechange(event.target.value)
			},
			React.createElement('option', {
				value: "5"
			}, "5sec"),
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
				value: "25"
			}, "25sec"),
			React.createElement('option', {
				value: "30"
			}, "30sec"),
			React.createElement('option', {
				value: "40"
			}, "40sec"),
			React.createElement('option', {
				value: "50"
			}, "50sec"),
			React.createElement('option', {
				value: "60"
			}, "60sec"),
			React.createElement('option', {
				value: "70"
			}, "70sec"),
			React.createElement('option', {
				value: "80"
			}, "80sec"),
			React.createElement('option', {
				value: "90"
			}, "90sec"),
			React.createElement('option', {
				value: "100"
			}, "100sec"),
			React.createElement('option', {
				value: "120"
			}, "120sec"),
			React.createElement('option', {
				value: "150"
			}, "150sec"),
			React.createElement('option', {
				value: "180"
			}, "180sec"),
			React.createElement('option', {
				value: "240"
			}, "240sec"),
			React.createElement('option', {
				value: "300"
			}, "300sec"),
		),
	)
}

function hourglass (props) {

	return React.createElement("div", {}, 
		React.createElement('label', {}, "hourglass time "),
		React.createElement('select', {
				style: {
					fontSize: "100%"
				},
				value: props.details,
				onChange: event => props.statechange(event.target.value)
			},
			React.createElement('option', {
				value: "5"
			}, "5sec"),
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
				value: "25"
			}, "25sec"),
			React.createElement('option', {
				value: "30"
			}, "30sec"),
			React.createElement('option', {
				value: "40"
			}, "40sec"),
			React.createElement('option', {
				value: "50"
			}, "50sec"),
			React.createElement('option', {
				value: "60"
			}, "60sec"),
			React.createElement('option', {
				value: "70"
			}, "70sec"),
			React.createElement('option', {
				value: "80"
			}, "80sec"),
			React.createElement('option', {
				value: "90"
			}, "90sec"),
			React.createElement('option', {
				value: "100"
			}, "100sec"),
			React.createElement('option', {
				value: "120"
			}, "120sec"),
			React.createElement('option', {
				value: "150"
			}, "150sec"),
			React.createElement('option', {
				value: "180"
			}, "180sec"),
			React.createElement('option', {
				value: "240"
			}, "240sec"),
			React.createElement('option', {
				value: "300"
			}, "300sec"),
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
				value: "18"
			}, "17"),
			React.createElement('option', {
				value: "18"
			}, "16"),
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
			value: "5"
		}, "5"),
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
		React.createElement('option', {
			value: "100"
		}, "100"),
	),
)
}

function throw_enemy(props) {
	return React.createElement('div', {
			className: "room_tableau"
		},
		React.createElement('label', {}, " throw malus"),
		React.createElement('input', {
			type: "checkbox",
			checked: props.details.throw_malus ? "checked" : "",
			onClick: () => props.statechange_malus(),
			onChange: () => {}
		}),
		React.createElement('label', {}, " throw discard"),
		React.createElement('input', {
			type: "checkbox",
			checked: props.details.throw_discard ? "checked" : "",
			onClick: () => props.statechange_discard(),
			onChange: () => {}
		}, ),
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
			name : "mode",
			type: "radio",
			id: "timed_checkbox",
			checked: props.mode === "normal",
			onClick: () => {
				props.statechange_mode("normal")
			},
			onChange: () => {}
		}),
		React.createElement('label', {onClick: () => { props.statechange_mode("normal") },}, "vs. player\u00A0\u00A0"),
		React.createElement('input', {
			style: {
				width: "15px",
				height: "15px"
			},
			name : "mode",
			type: "radio",
			id: "timed_checkbox",
			checked: props.mode === "ai",
			onClick: () => {
				props.statechange_mode("ai")
			},
			onChange: () => {}
		}),
		React.createElement('label', {onClick: () => { props.statechange_mode("ai") },}, "vs. AI\u00A0\u00A0"),
		React.createElement('input', {
			style: {
				width: "15px",
				height: "15px"
			},
			name : "mode",
			type: "radio",
			id: "timed_checkbox",
			checked: props.mode === "custom",
			onClick: () => {
				props.statechange_mode("custom")
			},
			onChange: () => {}
		}),
		React.createElement('label', {onClick: () => { props.statechange_mode("custom") },}, "custom\u00A0\u00A0"),
	)
}

function pending_rooms(props) {
	function join_click(redid, secret) {
		console.log(redid)
		if (redid != socket.id) {
			if (secret)
				socket.emit("client_join", {
					redid: redid,
					cookie: document.cookie,
					secret: prompt("Enter Room Password")
				})
			else
				socket.emit("client_join", {
					redid: redid,
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
					onClick: () => room.red_user.initial_socketid != socket.id ? props.statechange(room) : ""
				}, room.settings.name), //missing roomname click for roomdetails
				room.settings.secret ? " 🔒" : " ", room.red_user.initial_socketid != socket.id && room.red_user.socketid_cookie_on_reation != getCookie("socketid") ? React.createElement('button', {
					onClick: () => join_click(room.red_user.initial_socketid, room.settings.secret),
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
		lowest_malus_red : settings.malus_size,
		lowest_malus_black : settings.malus_size,
		time_control: settings.time_control,
		timer_red: settings.time_control === "hourglass" ? (settings.time / 2) : settings.time,
		timer_black: settings.time_control === "hourglass" ? (settings.time / 2) : settings.time,
		abort_counter: 0,
		turn_counter: 0,
	}
	var blackdeck = shuffle(freshDeck("black"))
	var reddeck = shuffle(freshDeck("red"))
	for (var p = 0; p < 2; p++)
		for (var ms = 0; ms < settings.malus_size; ms++) {
			if (p === 1) {
				while(reddeck[reddeck.length - 1].value === 13|| reddeck[reddeck.length - 1].value === 1) {
					reddeck = shuffle(reddeck)
				}
					
			}
			else
				while(blackdeck[blackdeck.length - 1].value === 13 || blackdeck[blackdeck.length - 1].value === 1){
					blackdeck = shuffle(blackdeck)
				}
			var card = p === 0 ? blackdeck.pop() : reddeck.pop()
			game[(p === 0 ? "black" : "red") + "malus"].push(card)
	}

	game.turn = shuffle(["red", "black"])[0]
	for (var p = 0; p < 2; p++)
		for (var tableau_nr = 0; tableau_nr < 4; tableau_nr++)
			for (var ts = 0; ts < settings.tableau_size; ts++) {

				var card = (p === 0 ? blackdeck.pop() : reddeck.pop())
				game[((p === 0 ? "black" : "red") + "tableau" + tableau_nr)].push(card)
			}
		game.redstock = reddeck
		game.blackstock = blackdeck
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
	const values = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
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

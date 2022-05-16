import {
	socket
} from "./index.js"
import {
	game_chat
} from "./game_chat.js"
import {
	game_stack
} from "./game_stack.js"
import {
	PON_from_game,
	PON_from_action,
	PON_from_card,
	game_from_PON,
	stack_names_from_PON,
	actions_from_PON,
	action_PON,
} from "./PON.js"
import {
	weighted_action_sequences
} from "./ai.js"

var drag_counter = 0 //used for styling only
var audio = new Audio('https://patienceonlinecards.s3.eu-central-1.amazonaws.com/mixkit-game-ball-tap-2073.wav');
var audio2 = new Audio('https://patienceonlinecards.s3.eu-central-1.amazonaws.com/random.wav')

export class game extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			color: this.props.color,
			initial_game_pon: this.props.game_PON,
			ghost_cards: [],
			ai_action_stack: [],
			show_chat: false,
			dragging: false,
			ghost_dragging: false,
			messages: [],
		}
		this.load_game_pon(this.props.game_PON)

		if (this.props.last_action) {
			this.state.last_action = new Date(this.props.last_action)
		}
		this.state["timer_" + this.state.turn] = this.state["timer_" + this.state.turn] - (new Date() - this.state.last_action) / 1000

		this.state.interval = setInterval(() => {
			if (!this.props.preview && (this.state.ai_action_stack.length === 0) && !this.state.branched_off && this.state.ghost_cards.length === 0 && ((this.props.red.username === "AI" && this.state.turn === "red") || (this.props.black.username === "AI" && this.state.turn === "black"))) {
				this.gen_ai_action_sequence()
			}
			if (!this.props.preview && !this.state.game_ended && this.state.timer_red > 0 && this.state.timer_black > 0) {
				this.setState({
					["timer_" + this.state.turn]: !this.state.branched_off ? (this.state["timer_" + this.state.turn] - 0.008).toFixed(3) : this.state["timer_" + this.state.turn],
				})
			}	
			else {
				this.setState({
					timer_deactivated: true
				})
				if(this.props.offline && !this.props.preview && !this.state.game_ended) {
					alert("game ended\nwinner: "+(this.state.turn === "red"? "black" : "red"))
					this.state.game_ended = "="+(this.state.turn === "red"? "b" : "r") + "t"
					this.state.game_pon = this.game_pon()
				}
			}

			if (this.state.ghost_cards.length > 0)
				if (document.getElementById(this.state.ghost_cards[this.state.ghost_cards.length - 1]).style.opacity != "0.8")
					for (var card of this.state.ghost_cards) {
						if (document.getElementById(card) && PON_from_card(this.state.ghost_dragging) != card)
							document.getElementById(card).style.opacity = "0.8"
					}
		}, 8)

		if (!this.props.offline) {
			socket.on("chat_update", data => {
				var opponent_username = this.state.color === "black" ? this.props.red_username ? this.props.red_username : "opponent" : this.props.black_username ? this.props.black_username : "opponent"
				this.state.messages.push({
					sender: opponent_username,
					text: data
				})
				if(!this.state.show_chat) {
					document.getElementById("openchat").style.backgroundColor = "red"
					document.getElementById("openchat").style.color = "white"
				}
			
				setTimeout(() => {
					const element = document.getElementById("chat");
					element.scrollTop = element.scrollHeight;
				}, 300)
			})

			socket.on("game_update", (data) => {
				if (this.state.ghost_dragging)
					document.getElementById(PON_from_card(this.state.ghost_dragging)).style.opacity = 1
				this.state.ghost_dragging = false
				if (this.state.ghost_cards.length > 0) {
					for (var card of this.state.ghost_cards) {
						if (document.getElementById(card) && PON_from_card(this.state.ghost_dragging) != card)
							document.getElementById(card).style.opacity = 1
					}
					this.state.ghost_cards.length = 0
					this.load_boardstate(this.state.replay_step + 1)
				}
				var step = this.state.replay_step
				if (step < this.state.actions.length) {
					for (var i = 0; i < this.state.actions.length - step; i++)
						this.replay_next()
				}
				this.state.last_action = new Date()
				var action = {a : data, timer_red : this.state.timer_red, timer_black : this.state.timer_black}
				this.state.actions.push(action)
				this.game_update_handler(action)
			})

			socket.on("server_game_end", (data) => { 
				alert("game ended\nwinner: "+ data.winner)
				this.state.game_ended = "="+data.conclusion
				this.state.game_pon = this.game_pon()
			})
		}
	}

	load_game_pon = (game_pon) => {
		this.state.game_states = [game_pon.substring(0, game_pon.indexOf("}") + 1)]
		this.state.replay_step = -1
		this.load_boardstate(0)

		this.state.moves_counter_limit = this.state.moves_counter
		this.state.actions = actions_from_PON(game_pon.substring(game_pon.indexOf("}") + 1, game_pon.indexOf("=") != -1 ? game_pon.indexOf("=") : game_pon.length))


		this.state.game_ended = game_pon.indexOf("=") != -1 ? game_pon.substring(game_pon.indexOf("=") + 1, game_pon.length) : false,
			this.state.game_pon = game_pon
		this.state.last_action = new Date()
		this.state.branched_off = false

		if (game_pon.indexOf("=") != -1)
			this.state.game_ended = game_pon.substring(game_pon.indexOf("="), game_pon.length)
		if (this.state.actions.length === 0) {
			this.state.last_moved1 = false
			this.state.last_moved2 = false
		}
		for (var i = 0; i < this.state.actions.length; i++) {
			this.state.timer_red = this.state.actions[i].timer_red
			this.state.timer_black = this.state.actions[i].timer_black
			this.game_update_handler(this.state.actions[i])
		}
		if (this.props.preview)
			this.props.statechange_last_game_pon(this.state.game_states[this.state.game_states.length - 1])
	}

	game_update_handler = (data) => {
		if (!data.a) return
		var action = stack_names_from_PON(data.a)
		if(this.state.ghost_cards.length === 0)
			this.state.copied = false
		this.state.last_moved1 = action[0]
		this.state.last_moved2 = action[1]

		audio2.play()
		if (action[1].includes(this.state.turn) && action[1].includes("discard")) {
			if (this.state.turn != this.state.color)
				audio.play()
		}

		if (!(this.state.turn === "red" && data.a[2] + data.a[3] === "rd") && !(this.state.turn === "black" && data.a[2] + data.a[3] === "bd")) {
			if (!action[1].includes("foundation") && !action[0].includes("stock"))
				this.state.moves_counter = this.state.moves_counter - 1
		}
		if ( (this.state.moves_counter === 0 && this.state[this.state.turn+"stock"].length === 0) || (this.state.turn === "red" && data.a[2] + data.a[3] === "rd") || (this.state.turn === "black" && data.a[2] + data.a[3] === "bd")) {
			this.state.turn_counter = this.state.turn_counter + 1
			this.state.moves_counter = this.state.moves_counter_limit

			if (this.state[(this.state.turn === "red" ? "black" : "red") + "stock"].length === 0) {
				var dc = JSON.parse(JSON.stringify(this.state[(this.state.turn === "red" ? "black" : "red") + "discard"]))
				dc.reverse()
				this.state[(this.state.turn === "red" ? "black" : "red") + "stock"] = dc
				this.state[(this.state.turn === "red" ? "black" : "red") + "discard"].length = 0
			}
			this.state["timer_"+this.state.turn] = Number(this.state["timer_"+this.state.turn]) + Number(this.state.increment)
			this.state.turn = this.state.turn === "red" ? "black" : "red"
			if ( !this.props.preview && this.props.offline && this.props.red.username != "AI" && this.props.black.username != "AI" && this.state.ghost_cards.length === 0)
				this.state.color = this.state.turn
			if ((this.props.red.username === "AI") || (this.props.black.username === "AI")) {
				if (this.state.ai_action_stack.length > 0) {
					this.state.ai_action_stack.length = 0
					clearTimeout(this.state.ai_action_timeout)
				}
			}
		}

		this.state[action[1]].push(this.state[action[0]].pop())

		if (action[0].includes("stock") && !action[1].includes("discard")) {
			if ((action[0].includes("red") && action[1] != "reddiscard") || (action[0].includes("black") && action[1] != "blackiscard"))
				if (this.state[action[0]].length === 0) {
					var dc = JSON.parse(JSON.stringify(this.state[(action[0].includes("red") ? "red" : "black") + "discard"]))
					dc.reverse()
					this.state[action[0]] = dc
					this.state[(action[0].includes("red") ? "red" : "black") + "discard"].length = 0
				}
		}
		if (this.state.ghost_cards.length === 0) {
			this.state.replay_step++
			this.state.game_pon = this.game_pon()
			this.state.game_states.push(PON_from_game(JSON.parse(JSON.stringify(this.state))))
			if (this.props.preview && this.state.game_states.length === this.state.actions.length + 1) {
				this.props.statechange_last_game_pon(this.state.game_states[this.state.game_states.length - 1])
			}

		}
	}

	ghost_game_action = (from_card, to_stack) => {
		if (!from_card || !to_stack) return
		if (this.state.ghost_dragging)
			document.getElementById(PON_from_card(this.state.ghost_dragging)).style.opacity = 1
		this.state.ghost_dragging = false
		drag_counter = 0
		var a = PON_from_action({
			from_stack: from_card.name,
			to_stack: to_stack
		})
		this.state.ghost_cards.push(PON_from_card(from_card))
		this.game_update_handler({
			a: a,
		})
		if (this.state.moves_counter === 0  && to_stack != this.state.turn+"discard") {
			if (this.state[this.state.turn + "stock"].length > 0) {
				a = PON_from_action({
					from_stack: this.state.turn + "stock",
					to_stack: this.state.turn + "discard",
				})
				this.state.ghost_cards.push(PON_from_card(this.state[this.state.turn + "stock"][this.state[this.state.turn + "stock"].length - 1]))
				this.game_update_handler({
					a : a,
				})
			}	
		}
	}

	offline_game_action = (from_card, to_stack) => {
		var a = PON_from_action({
			from_stack: from_card.name,
			to_stack: to_stack
		})
		var action = {
			a: a,
		}
		this.state.actions.push({a : a, timer_red : this.state.timer_red, timer_black : this.state.timer_black})
		this.state.last_action = new Date()
		if(this.state[this.state.turn+"malus"].length + this.state[this.state.turn+"reserve"].length === 1 && (from_card.name.includes("malus") || from_card.name.includes("reserve"))) {
			alert("game ended\nwinner: "+ this.state.turn)
			this.state.game_ended = "=" + (this.state.turn === "red" ? "r" : "b" )+ "m"
			this.state.game_pon = this.game_pon()
		}		
		this.game_update_handler(action)
		if (this.state.moves_counter === 0 && to_stack != this.state.turn+"discard") {
			if (this.state[this.state.turn + "stock"].length > 0) {
				a = PON_from_action({
					from_stack: this.state.turn + "stock",
					to_stack: this.state.turn + "discard",
				})
				var action = {
					a: a,
				}
				this.state.actions.push(action)
				this.state.timer_red = this.state.timer_red
				this.state.timer_black = this.state.timer_black
				this.game_update_handler(action)
			}
		}
	}

	drop_event = (from_card, to_stack) => {
		if (!from_card || !to_stack) return
		this.state.dragging_over = ""
		this.state.dragging = false
		drag_counter = 0
		if (from_card.name != to_stack)
			if (this.valid_drop(from_card, to_stack))
				if (this.props.offline) 
					this.offline_game_action(from_card, to_stack)
				else
					socket.emit("game_action", from_card.name, to_stack)
	}

	drag_event = (event) => {
		if (this.state.ghost_dragging) {
			document.getElementById(PON_from_card(this.state.ghost_dragging)).style.opacity = 1
			this.state.ghost_dragging = false
		}
		if (event.type === "dragenter")
			drag_counter++
		if (event.type === "dragleave")
			drag_counter--
		if (drag_counter === 0)
			this.state.dragging_over = ""
		else
			this.state.dragging_over = event.target.attributes.data_stack.value
	}

	dragstart_event = (card, ghost_move) => {
		if (this.props.preview) return false
		if (this.state.game_ended && !ghost_move) return false
		if (this.props.spectator && !ghost_move) return false
		if (this.state.ghost_cards.length > 0 && !ghost_move) return false
		if (this.state.branched_off && !ghost_move) return false
		if (!card.uppermost) return false
		if (!card.faceup) return false
		if (card.name.includes("discard")) return false
		if ((card.name.includes("malus") || card.name.includes("stock")) && !card.name.includes(this.state.turn)) return false
		if (card.name.includes("reserve") && !card.name.includes(this.state.turn)) return false
		if (!(this.state.turn === this.state.color || ghost_move)) return false
		return true
	}

	statechange_dragging = (card, event) => {
		if (card) 
			event.target.style.opacity = "0.5"
		else if (event)
			event.target.style.opacity = "1"
		this.state.dragging = card
	}

	valid_drop = (from_card, to_stack) => {
		if (!(from_card && to_stack))
			return false
		if (this.state[to_stack].length > 0)
			var to_card = this.state[to_stack][this.state[to_stack].length - 1]
		if (this.state.turn_counter === 0 && from_card.name.includes("malus"))
			return false
		if (from_card.name.includes("malus") && !(to_stack.includes("tableau") || to_stack.includes("foundation")))
			return false
		if (to_stack.includes("reserve")) {
			if (to_card)
				return false
			if (!(from_card.name.includes("tableau")))
				return false
			if (!to_stack.includes(this.state.turn))
				return false
			return true
		}
		if (to_stack.includes("stock"))
			return false
		if (to_stack.includes("discard")) {
			if (to_stack.includes(this.state.turn)) {
				if (from_card.name.includes("tableau") || from_card.name.includes("stock"))
					return true
				else
					return false
			}
			if (this.state.turn_counter === 0)
				return false
			if (!(from_card.name.includes("tableau")))
				return false
			if (to_card === undefined)
				return true
			if (from_card.suit != to_card.suit && to_card.value === from_card.value)
				return true
			if (from_card.suit === to_card.suit) {
				if (from_card.value === to_card.value + 1 || from_card.value === to_card.value - 1)
					return true
				if ((from_card.value === 13 && to_card.value === 1) || (from_card.value === 1 && to_card.value === 13))
					return true
				return false
			}
			return false
		}
		if (to_stack.includes("malus")) {
			if (!to_stack.includes(this.state.turn) && this.state.turn_counter === 0)
				return false
			if (!(from_card.name.includes("tableau")))
				return false
			if (to_card === undefined)
				return true
			if (from_card.suit != to_card.suit && to_card.value === from_card.value)
				return true
			if (from_card.suit === to_card.suit) {
				if (from_card.value === to_card.value + 1 || from_card.value === to_card.value - 1)
					return true
				if ((from_card.value === 13 && to_card.value === 1) || (from_card.value === 1 && to_card.value === 13))
					return true
				return false
			}
			return false
		}
		if (to_stack.includes("foundation")) {
			if (from_card.name.includes("foundation"))
				return false
			if (to_card != undefined) {
				if (from_card.suit === to_card.suit)
					if (from_card.value - 1 === to_card.value)
						return true
			} else if (from_card.value === 1)
				return true
			return false
		}
		if (to_stack.includes("tableau")) {
			if (to_card != undefined) {
				if (from_card.value + 1 === to_card.value) {
					if (from_card.suit === "spades" || from_card.suit === "clubs")
						if (to_card.suit === "hearts" || to_card.suit === "diamonds")
							return true
					if (from_card.suit === "hearts" || from_card.suit === "diamonds")
						if (to_card.suit === "spades" || to_card.suit === "clubs")
							return true
				}
			} else
				return true
			return false
		}
	}

	stack_color = (stack_name) => {
		var defaultColor1 = "#f1debe"
		var dragging = "#bdb191"
		var regular_move = "#9bb3de"
		var discard_move = "#778191"
		var free_move = "#cce2ff"
		var player_turn = "#75d975"
		var player_turn_discard = "#4a8f4a"
		var grey = "#a6a19c"
		var enemy_turn = "#ff5e36"
		var dragging_over_free = "#b2d3fe"
		var dragging_over_regular = "#7f9cd4"
		var dragging_over_discard = "#646d7c"
		var last_move_from = "#e4d487"
		var last_move_to = "#d5c245"
		if (stack_name === "redmalus" || stack_name === "blackmalus" ||
			stack_name === "redstock" || stack_name === "blackstock" ||
			stack_name === "reddiscard" || stack_name === "blackdiscard" ||
			stack_name === "redreserve" || stack_name === "blackreserve" ||
			stack_name === "redtableau0" || stack_name === "blacktableau0" ||
			stack_name === "redtableau1" || stack_name === "blacktableau1" ||
			stack_name === "redtableau2" || stack_name === "blacktableau2" ||
			stack_name === "redtableau3" || stack_name === "blacktableau3" ||
			stack_name === "redfoundation0" || stack_name === "blackfoundation0" ||
			stack_name === "redfoundation1" || stack_name === "blackfoundation1" ||
			stack_name === "redfoundation2" || stack_name === "blackfoundation2" ||
			stack_name === "redfoundation3" || stack_name === "blackfoundation3") {
			var color

			if (stack_name === this.state.dragging_over && this.state.dragging_over && this.valid_drop(this.state.dragging, this.state.dragging_over)) {
				if ((this.state.dragging.name.includes("stock") && stack_name != this.state.turn + "discard") || stack_name.includes("foundation"))
					return dragging_over_free
				if (stack_name === this.state.color + "discard")
					return dragging_over_discard
				else
					return dragging_over_regular
			}

			if (this.state.ghost_dragging && this.valid_drop(this.state.ghost_dragging, stack_name)) {
				if ((this.state.ghost_dragging.name.includes("stock") && stack_name != this.state.turn + "discard") || stack_name.includes("foundation"))
					return free_move
				if (stack_name === this.state.color + "discard")
					return discard_move
				else
					return regular_move
			}

			if (this.state.dragging && this.valid_drop(this.state.dragging, stack_name)) {
				if ((this.state.dragging.name.includes("stock") && stack_name != this.state.turn + "discard") || stack_name.includes("foundation"))
					return free_move
				if (stack_name === this.state.color + "discard")
					return discard_move
				else
					return regular_move
			} else
			if (this.state.turn === this.state.color && ((stack_name === this.state.color + "reserve") || stack_name === this.state.color + "malus")) {
				color = player_turn
				if (!this.state.dragging && this.state.last_moved1 === stack_name)
					color = last_move_from
				else if (!this.state.dragging && this.state.last_moved2 === stack_name)
					color = last_move_to
				if (this.state.dragging ? this.state.dragging.name === stack_name : false)
					color = player_turn_discard
			} else {
				if (stack_name.includes("reserve") || stack_name.includes("malus")) {
					if ((stack_name.includes(this.state.color) && this.state.turn != this.state.color) || (!stack_name.includes(this.state.color) && this.state.turn === this.state.color)) {
						color = grey
					} else {
						color = enemy_turn
					}
				} else {
					color = defaultColor1
				}
				if (!this.state.dragging && this.state.last_moved1 === stack_name)
					color = last_move_from
				else if (!this.state.dragging && this.state.last_moved2 === stack_name)
					color = last_move_to
				if (this.state.dragging ? this.state.dragging.name === stack_name : false)
					color = dragging
			}
			return color
		}
		return false
	}

	replay_next = () => {
		if (this.state.ghost_dragging)
			document.getElementById(PON_from_card(this.state.ghost_dragging)).style.opacity = 1
		this.state.dragging = false
		this.state.ghost_dragging = false
		if (this.state.replay_step === this.state.actions.length - 1)
			return
		this.load_boardstate(this.state.replay_step + 2)
		this.state.last_moved1 = stack_names_from_PON(this.state.actions[this.state.replay_step + 1].a)[0]
		this.state.last_moved2 = stack_names_from_PON(this.state.actions[this.state.replay_step + 1].a)[1]
		this.state.replay_step = this.state.replay_step + 1
		this.state.game_pon = this.game_pon()

		if (this.state.replay_step != this.state.actions.length - 1) {
			this.state.branched_off = true
		} else {
			this.state.branched_off = false
			var val = (new Date() - this.state.last_action) / 1000
			this.state["timer_" + this.state.turn] = this.state["timer_" + this.state.turn] - val
		}
		this.state.copied = false
	}

	replay_back = () => {
		if (this.state.ghost_dragging)
			document.getElementById(PON_from_card(this.state.ghost_dragging)).style.opacity = 1
		this.state.dragging = false
		this.state.ghost_dragging = false
		if (this.state.ghost_cards.length > 0) {
			for (var card of this.state.ghost_cards) {
				if (document.getElementById(card) && PON_from_card(this.state.ghost_dragging) != card)
					document.getElementById(card).style.opacity = 1
			}
			this.state.ghost_cards.length = 0
		}
		if (this.state.replay_step === -1) {
			return
		}
		if (this.state.replay_step === 0) {
			this.state.last_moved1 = false
			this.state.last_moved2 = false
		} else {
			this.state.last_moved1 = stack_names_from_PON(this.state.actions[this.state.replay_step - 1].a)[0]
			this.state.last_moved2 = stack_names_from_PON(this.state.actions[this.state.replay_step - 1].a)[1]
		}
		this.load_boardstate(this.state.replay_step)
		this.state.replay_step = this.state.replay_step - 1
		this.state.game_pon = this.game_pon()
		this.state.branched_off = true
		this.state.copied = false
	}

	replay_slider = (e) => {
		var val = e.target.value
		var rep = this.state.replay_step
		if (rep < val) 
			for (var i = 0; i < val - rep; i++)
				this.replay_next()
		if (val < rep) 
			for (var i = 0; i < rep - val; i++)
				this.replay_back()
	}

	load_boardstate = (replay_step) => {
		var g = game_from_PON(this.state.game_states[replay_step])
		this.state.blackmalus = g.blackmalus
		this.state.blackreserve = g.blackreserve
		this.state.blackstock = g.blackstock
		this.state.blackdiscard = g.blackdiscard
		this.state.blacktableau0 = g.blacktableau0
		this.state.blacktableau1 = g.blacktableau1
		this.state.blacktableau2 = g.blacktableau2
		this.state.blacktableau3 = g.blacktableau3
		this.state.blackfoundation0 = g.blackfoundation0
		this.state.blackfoundation1 = g.blackfoundation1
		this.state.blackfoundation2 = g.blackfoundation2
		this.state.blackfoundation3 = g.blackfoundation3
		this.state.redmalus = g.redmalus
		this.state.redreserve = g.redreserve
		this.state.redstock = g.redstock
		this.state.reddiscard = g.reddiscard
		this.state.redtableau0 = g.redtableau0
		this.state.redtableau1 = g.redtableau1
		this.state.redtableau2 = g.redtableau2
		this.state.redtableau3 = g.redtableau3
		this.state.redfoundation0 = g.redfoundation0
		this.state.redfoundation1 = g.redfoundation1
		this.state.redfoundation2 = g.redfoundation2
		this.state.redfoundation3 = g.redfoundation3
		this.state.moves_counter = g.moves_counter
		this.state.timer_black = g.timer_black ? g.timer_black : -1
		this.state.timer_red = g.timer_red ? g.timer_red : -1
		this.state.turn = g.turn ? g.turn : "red"
		this.state.increment = g.increment >= 0 ? g.increment : -1
		this.state.turn_counter = g.turn_counter > -1 ? g.turn_counter : -1
	}

	game_pon = () => {
		var actions = ""
		for (var i = 0; i <= this.state.replay_step; i++) {
			actions = actions + action_PON(this.state.actions[i].a, this.state.actions[i].timer_red, this.state.actions[i].timer_black)
			actions += ","
		}
		actions = actions.slice(0, actions.length - 1)
		return this.state.game_states[0] + actions + (this.state.replay_step === this.state.actions.length-1 && this.state.game_ended ? this.state.game_ended : "")
	}

	gen_ai_action_sequence = () => {
		this.state.ai_action_stack = weighted_action_sequences(this.state)
		this.state.ai_action_stack = this.state.ai_action_stack.b
		this.state.ai_action_stack.reverse()
		if (this.state.ai_action_stack.length > 0)
			this.ai_action_timeout()
	}

	ai_action_timeout = () => {
		clearTimeout(this.state.ai_action_timeout)
		this.state.ai_action_timeout = setTimeout(() => {
			var action = this.state.ai_action_stack.pop()
			if (this.state[action[0]][this.state[action[0]].length - 1])
				var card = JSON.parse(JSON.stringify(this.state[action[0]][this.state[action[0]].length - 1]))
			else return
			card.name = action[0]
			this.drop_event(card, action[1])
			if (this.state.ai_action_stack.length > 0)
				this.ai_action_timeout()
		}, 1000)
	}

	rightclick_event = (card_right_clicked, stackname) => {
		if (this.state.dragging)
		this.state.dragging =false 
		if (this.state.ghost_dragging) {
			if (this.state.ghost_dragging.name === stackname) {
				if (this.state.ghost_dragging) {
					document.getElementById(PON_from_card(this.state.ghost_dragging)).style.opacity = "1"
					this.state.ghost_dragging = false
				}
				return
			}
			if (this.valid_drop(this.state.ghost_dragging, stackname)) {
				this.ghost_game_action(this.state.ghost_dragging, stackname)
				return
			} else document.getElementById(PON_from_card(this.state.ghost_dragging)).style.opacity = 1
		}
		if (card_right_clicked) {
			card_right_clicked.name = stackname
			card_right_clicked.uppermost = true
			if (this.dragstart_event(card_right_clicked, true)) {
				this.state.dragging = false
				this.state.ghost_dragging = card_right_clicked
				document.getElementById(PON_from_card(card_right_clicked)).style.opacity = "0.5"
			}
		}
	}

	leftclick_event = (card_left_clicked, stackname) => {
		if (this.state.ghost_dragging) {
			document.getElementById(PON_from_card(this.state.ghost_dragging)).style.opacity = 1
			this.state.ghost_dragging = false
		}
		if (this.state.dragging) {
			if (this.state.dragging.name === stackname) {
				this.state.dragging_over = ""
				this.state.dragging = false
				return
			}
			if (this.valid_drop(this.state.dragging, stackname)) {
				this.drop_event(this.state.dragging, stackname)
				return
			}

		}
		if (card_left_clicked) {
			card_left_clicked.name = stackname
			card_left_clicked.uppermost = true
			if (this.dragstart_event(card_left_clicked))
				this.state.dragging = card_left_clicked
		}
	}

	statechange_messages = (messages) => {
		this.state.messages = messages
	}

	componentWillUnmount() {
		if (!this.props.offline) {
			socket.off("game_update")
			socket.off("chat_update")
			socket.off("server_game_end")
		}
		clearTimeout(this.state.ai_action_timeout)
		clearInterval(this.state.interval)
	}

	render() {
		var components = []
		for (var state_key of Object.keys(this.state)) {
			if (index != undefined)
				index++
			else var index = 0
			if (state_key === "redmalus" || state_key === "blackmalus" ||
				state_key === "redstock" || state_key === "blackstock" ||
				state_key === "reddiscard" || state_key === "blackdiscard" ||
				state_key === "redreserve" || state_key === "blackreserve" ||
				state_key === "redtableau0" || state_key === "blacktableau0" ||
				state_key === "redtableau1" || state_key === "blacktableau1" ||
				state_key === "redtableau2" || state_key === "blacktableau2" ||
				state_key === "redtableau3" || state_key === "blacktableau3" ||
				state_key === "redfoundation0" || state_key === "blackfoundation0" ||
				state_key === "redfoundation1" || state_key === "blackfoundation1" ||
				state_key === "redfoundation2" || state_key === "blackfoundation2" ||
				state_key === "redfoundation3" || state_key === "blackfoundation3") {
				components.push(
					React.createElement(game_stack, {
						key: index,
						cards: this.state[state_key],
						name: state_key,
						player: state_key.includes(this.state.color) ? true : false,
						turn: this.state.turn === this.state.color ? true : false,
						color: this.stack_color(state_key),
						drag_event: this.drag_event,
						statechange_dragging: this.statechange_dragging,
						drop_event: this.drop_event,
						dragstart_event: this.dragstart_event,
						leftclick_event: this.leftclick_event,
						rightclick_event: this.rightclick_event
					}, "")
				)
			}
		}
		return React.createElement('div', {
				id: "Game",
				onMouseDown: e => {
					if (e.buttons === 4 || e.buttons === 1) {
						if (this.state.ghost_cards.length > 0) {
							if (e.buttons === 4)
								this.state.dragging = false
							if (this.state.ghost_dragging)
								document.getElementById(PON_from_card(this.state.ghost_dragging)).style.opacity = 1
							this.state.ghost_dragging = false
							this.load_boardstate(this.state.replay_step + 1)
							if(this.state.replay_step === this.state.game_states.length-2) {
								var val = (new Date() - this.state.last_action) / 1000
								this.state["timer_" + this.state.turn] = this.state["timer_" + this.state.turn] - val
							}
							if (this.state.replay_step > -1) {
								var action = stack_names_from_PON(this.state.actions[this.state.replay_step].a)
								this.state.last_moved1 = action[0]
								this.state.last_moved2 = action[1]
							} else {
								this.state.last_moved1 = false
								this.state.last_moved2 = false
							}
							if (this.state.ghost_cards.length > 0) {
								for (var card of this.state.ghost_cards) {
									if (document.getElementById(card) && PON_from_card(this.state.ghost_dragging) != card)
										document.getElementById(card).style.opacity = 1
								}
								this.state.ghost_cards.length = 0
							}
						}
					}
				},
				style: {
					fontFamily: "sans-serif",
					width:  ('ontouchstart' in document.documentElement && /mobi/i.test(navigator.userAgent)) ? "120vmax" : "",
					height: ('ontouchstart' in document.documentElement && /mobi/i.test(navigator.userAgent)) ? "100vmax" : "",
					position : "absolute",
					zIndex : 0,
				}
			},
			components,
			React.createElement(Timer, {
				player: this.state.color === "red" ? true : false,
				time: this.state.timer_red
			}),
			React.createElement(Timer, {
				player: this.state.color === "black" ? true : false,
				time: this.state.timer_black
			}),
			React.createElement("div" , {
				style : {
					border : "solid  #636363 3px",
					position: 'absolute',
					top :  "47.5vmin",
					left: this.state.moves_counter >= 10 ? "50.13vmax" : "50.19vmax",
					paddingLeft :this.state.moves_counter >= 10 ? ".1vmax" : ".35vmax",
					paddingRight :this.state.moves_counter >= 10 ? ".1vmax" : ".35vmax",
					background : "#f0e6ee"
				}
			},
				React.createElement("div", {
					style: {
						fontSize: "1.1vmax",
						color : this.state.moves_counter === 1 ? "#c95734" :"black"
					}
				}, React.createElement("b", {}, this.state.moves_counter)),
			),
		
			!this.props.preview ? React.createElement("div", {},
				React.createElement("b", {
					style: {
						position: 'absolute',
						top: "86vmin",
						left: "48.0vmax",
						fontSize: ".8vmax"
					}
				}, this.props[this.state.color].username ? this.props[this.state.color].username : "you"),
				React.createElement("b", {
					style: {
						position: 'absolute',
						top: "88vmin",
						left: "48.0vmax",
						fontSize: ".8vmax"
					}
				}, this.props[this.state.color].elo ? this.props[this.state.color].elo : ""),
				(!this.props.offline && !this.props.spectator&& !this.state.game_ended)? React.createElement("button", {
					style: {
						position: "absolute",
						top: "99vmin",
						left: "160vmin",
					},
					onClick: () => {
						if (confirm("surrender?"))
							socket.emit("client_surrender")
					}
				}, "surrender") : "",
				this.props.spectator|| this.props.offline || (!this.props.offline && this.state.game_ended) ? React.createElement("button", {
					style: {
						position: "absolute",
						top: "99vmin",
						left: "20vmin",
					},
					onClick: () => {
						if(this.props.spectator)
							socket.emit("spectator_leave")
						this.props.end_offline_game()
					}
				}, "leave") : "",
				this.props.spectator ? React.createElement("button", {
					style: {
						position: "absolute",
						top: "99vmin",
						left: "91.5vmin",
					},
					onClick: () => {
						this.state.color=  this.state.color === "red" ? "black" : "red"
					},
				}, "change color") : "",
				React.createElement("input", {
					onClick : () => {
						navigator.clipboard.writeText(this.state.game_pon)
						this.state.copied = true
					},
					style: {
						position: "absolute",
						top: "99vmin",
						left: "110.5vmin",
					},
					type: "text",
					value: this.state.game_pon,
					onChange: (e) => {
						if (this.props.offline) {
							this.load_game_pon(e.target.value)
						}
					}
				}),
				this.state.copied ? React.createElement("div", {
					style: {
						position: "absolute",
						top: "99vmin",
						left: "130.5vmin",
						fontSize : "80%"
					},
				}, "copied to clipboard") : "",
				(!this.props.offline && !this.props.spectator && !this.state.game_ended) ? React.createElement("button", {
					id:"openchat",
					style: {
						position: "absolute",
						top: "99vmin",
						left: "10vmin",
					},
					onClick: () => {
						this.state.show_chat = !this.state.show_chat
						if(this.state.show_chat) {
							document.getElementById("openchat").style.backgroundColor = "white"
							document.getElementById("openchat").style.color = "black"
						}
					}
				}, (this.state.show_chat ? "close" : "open") + "\u00A0chat") : "",
				this.state.show_chat ? React.createElement(game_chat, {
					statechange_messages: this.statechange_messages,
					messages: this.state.messages,
					player_username: this.state.color === "red" ? this.props.red_username ? this.props.red_username : "you" : this.props.black_username ? this.props.black_username : "you",
				}) : "",

				React.createElement("b", {
					style: {
						position: 'absolute',
						top: "9vmin",
						left: "48.0vmax",
						fontSize: ".8vmax"
					}
				}, this.props[(this.state.color === "red" ? "black" : "red")].username ? this.props[(this.state.color === "red" ? "black" : "red")].username : "opponent"),

				React.createElement("b", {
					style: {
						position: 'absolute',
						top: "11vmin",
						left: "48.0vmax",
						fontSize: ".8vmax"
					}
				}, this.props[(this.state.color === "red" ? "black" : "red")].elo ? this.props[(this.state.color === "red" ? "black" : "red")].elo : ""),
				React.createElement("div", {
						style: {
							position: "absolute",

							top: "99vmin",
							left: "30vmin",
						}
					},
					React.createElement("button", {
						style: {

							position: "absolute",

							left: "56.5vmin",


						},
						onClick: this.replay_next

					}, "\u00A0\u00A0"),

					React.createElement("button", {
						style: {

							position: "absolute",


							left: "50%",
						},
						onClick: this.replay_back
					}, "\u00A0\u00A0"),

					React.createElement("input", {
						style: {
							position: "absolute",


							left: "4vmin",
							width: "50vmin"
						},
						type: "range",
						min: "-1",
						max: this.state.actions.length - 1,
						value: this.state.replay_step,
						className: "slider",
						id: "myRange",
						onChange: (e) => {
							this.replay_slider(e)
						}
					}),
				),
			) : "",
			React.createElement("div", {
				style: {
					left: "28vmax",
					position: "relative"
				}
			}, "\u00A0"),
		)
	}
}

function Timer(props) {
	var minutes = parseInt(props.time / 60)
	var seconds = parseInt(props.time % 60)
	return (
		React.createElement("div", {
			style: {
				position: 'absolute',
				top: props.player ? "92vmin" : "5vmin",
				left: "49.4vmax",
				fontSize: "1.1vmax"
			}
		}, (props.time > 0 ? (minutes > 9 ? minutes : "0" + minutes) + ":" + (seconds > 9 ? seconds : "0" + seconds) : "0"))
	)
}
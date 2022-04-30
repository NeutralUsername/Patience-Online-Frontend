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
	action_from_PON,
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
		this.state = game_from_PON(this.props.game_PON)
		this.state.color = this.props.color
		this.state.actions = actions_from_PON(this.props.actions_PON)
		this.state.last_action = new Date(this.props.last_action)
		this.state.moves_counter_limit = this.state.moves_counter
		this.state.replay_step = 0
		this.state.game_states = []
		this.state.ghost_cards = []
		this.state.ai_action_stack = []
		this.state.show_chat = false
		this.state.messages = []
		this.state.dragging = false
		this.state.ghost_dragging = false
		this.statechange_messages = this.statechange_messages.bind(this)
		this.drop_event = this.drop_event.bind(this)
		this.dragstart_event = this.dragstart_event.bind(this)
		this.statechange_dragging = this.statechange_dragging.bind(this)
		this.drag_event = this.drag_event.bind(this)
		this.is_valid_drop = this.is_valid_drop.bind(this)
		this.stack_color = this.stack_color.bind(this)
		this.game_update_handler = this.game_update_handler.bind(this)
		this.leftclick_event = this.leftclick_event.bind(this)
		this.rightclick_event = this.rightclick_event.bind(this)

		 this.state.interval = setInterval(() => {
			if( (this.state.ai_action_stack.length === 0) && (true ||(this.props.red.username === "AI" && this.state.turn === "red") ||( this.props.black.username === "AI" && this.state.turn === "black") )) {
				this.gen_ai_action_sequence()
			}
			if(!this.props.analysis_board)
				this.setState({
					["timer_" + this.state.turn]: !this.state.branched_off ? this.state["timer_" + this.state.turn] - 0.017 : this.state["timer_" + this.state.turn],
					["timer_" + (this.state.turn === "red" ? "black" : "red")]: !this.state.branched_off && this.state.time_control === "hourglass" ? this.state["timer_" + (this.state.turn === "red" ? "black" : "red")] + 0.017 : this.state["timer_" + (this.state.turn === "red" ? "black" : "red")]
				})
			else
				this.setState({analysis_board : true})
				if(this.state.ghost_cards.length > 0)
					for(var card of this.state.ghost_cards) {
						if(	document.getElementById(card) && PON_from_card(this.state.ghost_dragging) != card)
							document.getElementById(card).style.opacity = "0.8"
					}
		}, 17) 

		for (var i = 0; i < this.state.actions.length; i++) {
			this.game_update_handler(this.state.actions[i], true)
		}

		this.state.timer_red = this.props.timer_red ? this.props.timer_red : this.state.timer_red
		this.state.timer_black = this.props.timer_black ? this.props.timer_black : this.state.timer_black
	
		socket.on("chat_update", data => {
			var opponent_username = this.state.color === "black" ? this.props.red_username ? this.props.red_username : "opponent" : this.props.black_username ? this.props.black_username : "opponent"
			this.state.messages.push({
				sender: opponent_username,
				text: data
			})
			setTimeout(() => {
				const element = document.getElementById("chat");
				element.scrollTop = element.scrollHeight;
			}, 300)
		})

		socket.on("game_update", (data) => {
			if(this.state.ghost_cards.length > 0) {
				for(var card of this.state.ghost_cards) {
					if(	document.getElementById(card) && PON_from_card(this.state.ghost_dragging) != card)
						document.getElementById(card).style.opacity = 1
				}
				this.state.ghost_cards.length = 0
				this.setState({
					ghost_dragging: false
				})
				if(this.state.game_states.length > 0)
					this.setState(game_from_PON(this.state.game_states[this.state.replay_step-1]))
				else
				this.setState(game_from_PON(this.props.game_PON))
			}	
			var step = this.state.replay_step
			if (step < this.state.actions.length) {
				for (var i = 0; i < this.state.actions.length - step; i++)
					this.replay_next()
			}
			this.state.last_action = new Date()
			this.game_update_handler(data)

			if (step + 1 < this.state.actions.length)
				for (var i = 0; i < this.state.actions.length - step; i++)
					this.replay_back()
		})
	}

	componentWillUnmount() {
		socket.off("game_update")
		socket.off("chat_update")
		clearTimeout(this.state.ai_action_timeout)
		clearInterval(this.state.interval)
		clearInterval(this.state.interval)
	}

	rightclick_event (card_right_clicked, stackname) {
		if(this.state.dragging)
			this.setState({dragging : false})
		if(this.state.ghost_dragging ) {
			if(this.state.ghost_dragging.name === stackname) {
				if(this.state.ghost_dragging) {
					
					document.getElementById(PON_from_card(this.state.ghost_dragging)).style.opacity = "1"
					this.setState({ghost_dragging : false})
				}
				return
			}
			if(this.is_valid_drop(this.state.ghost_dragging, stackname)) {
				this.ghost_drop_event(this.state.ghost_dragging, stackname) 
				return
			}
			else 	document.getElementById(PON_from_card(this.state.ghost_dragging)).style.opacity = 1
		}
		if(card_right_clicked) {
			card_right_clicked.name = stackname
			card_right_clicked.uppermost = true
			if(this.dragstart_event(card_right_clicked, true)) {
				this.setState({dragging : false})
				this.setState({ghost_dragging : card_right_clicked})
				document.getElementById(PON_from_card(card_right_clicked)).style.opacity = "0.5"
			}
		}
	}

	leftclick_event (card_left_clicked, stackname) {
		if(this.state.ghost_dragging) {
			document.getElementById(PON_from_card(this.state.ghost_dragging)).style.opacity = 1
			this.setState({ghost_dragging : false})
		}
		if(this.state.dragging ) {
			if(this.state.dragging.name === stackname) {
				this.setState({
					dragging_over: "",
					dragging: false
				})
				return
			}
			if(this.is_valid_drop(this.state.dragging, stackname)) {
				this.drop_event(this.state.dragging, stackname)
				return
			}
		
		}
		if(card_left_clicked) {
			card_left_clicked.name = stackname
			card_left_clicked.uppermost = true
			if(this.dragstart_event(card_left_clicked))
				this.setState({dragging : card_left_clicked})
		}
	}

	gen_ai_action_sequence = () => {
		this.state.ai_action_stack =  weighted_action_sequences({
			redmalus : this.state.redmalus,
			redstock : this.state.redstock,
			reddiscard : this.state.reddiscard,
			redreserve : this.state.redreserve,
			redtableau0 : this.state.redtableau0,
			redtableau1 : this.state.redtableau1,
			redtableau2 : this.state.redtableau2,
			redtableau3 : this.state.redtableau3,
			blacktableau0 : this.state.blacktableau0,
			blacktableau1 : this.state.blacktableau1,
			blacktableau2 : this.state.blacktableau2,
			blacktableau3 : this.state.blacktableau3,
			redfoundation0 : this.state.redfoundation0,
			redfoundation1 : this.state.redfoundation1,
			redfoundation2 : this.state.redfoundation2,
			redfoundation3 : this.state.redfoundation3,
			blackfoundation0 : this.state.blackfoundation0,
			blackfoundation1 : this.state.blackfoundation1,
			blackfoundation2 : this.state.blackfoundation2,
			blackfoundation3 : this.state.blackfoundation3,
			blackmalus : this.state.blackmalus,
			blackstock : this.state.blackstock,
			blackdiscard : this.state.blackdiscard,
			blackreserve : this.state.blackreserve,
			turn :this.state.turn,
			moves_counter : this.state.moves_counter,
			turn_counter : this.state.turn_counter
		})
		this.state.ai_action_stack = this.state.ai_action_stack.b
		this.state.ai_action_stack.reverse()
		if(this.state.ai_action_stack.length > 0)
			this.ai_action_timeout()
	}

	ai_action_timeout = () => {
		clearTimeout(this.state.ai_action_timeout)
		this.state.ai_action_timeout = setTimeout( () => {
			var action = this.state.ai_action_stack.pop()
			var card = JSON.parse(JSON.stringify(this.state[action[0]][this.state[action[0]].length-1]))
			card.name = action[0]
			this.drop_event(card, action[1])
			if(this.state.ai_action_stack.length > 0)
				this.ai_action_timeout()
		},800)
	}

	game_update_handler(data, initializing, ghost_action) {
		if (!data.a)
			data = action_from_PON(data)
		if(!data.a) return
		var action = stack_names_from_PON(data.a)
		if(!this.props.analysis_board) {
			this.state.timer_red = data.timer_red,
			this.state.timer_black = data.timer_black
		}
		this.state.last_moved1 = action[0]
		this.state.last_moved2 = action[1]

		if (!this.props.analysis_board) {
			if (!initializing && !ghost_action)
				this.state.actions.push(data)
		}
		if (!initializing && !ghost_action) {
			audio2.play()
			if(action[1].includes(this.state.turn) && action[1].includes("discard")) {
				if(this.state.turn != this.state.color)
					audio.play()
			}
		}

		if (! (this.state.turn=== "red" && data.a[2]+data.a[3] === "rd") && ! (this.state.turn=== "black" && data.a[2]+data.a[3] === "bd") ) {
			if( !action[1].includes("foundation") && ! action[0].includes("stock"))
				this.state.moves_counter = this.state.moves_counter-1
		}
		if ( (this.state.turn=== "red" && data.a[2]+data.a[3] === "rd") || (this.state.turn=== "black" && data.a[2]+data.a[3] === "bd") ) {
			this.state.turn_counter = this.state.turn_counter + 1
			this.state.moves_counter = this.state.moves_counter_limit
		
			if(this.state[(this.state.turn === "red" ? "black" :"red") +"stock"].length === 0)  {
				var dc = JSON.parse(JSON.stringify(this.state[(this.state.turn === "red" ? "black" :"red") + "discard"]))
				dc.reverse()
				this.state[(this.state.turn === "red" ? "black" :"red")+"stock"] = dc
				this.state[(this.state.turn === "red" ? "black" :"red") + "discard"].length = 0
			}

			this.state.turn = this.state.turn === "red" ? "black" : "red"

			if (!initializing && !ghost_action && (this.props.red.current_socketid === "solo" || this.props.black.current_socketid === "solo"))
				this.state.color = this.state.turn
			if( (this.props.red.username === "AI" ) ||( this.props.black.username === "AI")) {
				if(	this.state.ai_action_stack.length > 0) {
					this.state.ai_action_stack.length = 0
					clearTimeout(this.state.ai_action_timeout)
				}
			}
		}
	
		this.state[action[1]].push(this.state[action[0]].pop())
		if ( action[0].includes("stock") && ! action[1].includes("discard")) {
			if( (action[0].includes("red") && action[1] != "reddiscard") || (action[0].includes("black") && action[1] != "blackiscard") )
				if(this.state[action[0]].length === 0) {
					var dc = JSON.parse(JSON.stringify(this.state[(action[0].includes("red") ? "red" : "black") + "discard"]))
					dc.reverse()
					this.state[action[0]] = dc
					this.state[(action[0].includes("red") ? "red" : "black") + "discard"].length = 0
				}
		}
		
		if (! (this.state.branched_off || (this.props.analysis_board && !initializing) || ghost_action ) ) {
			this.state.replay_step++
			this.state.game_states.push(PON_from_game(JSON.parse(JSON.stringify(this.state))))
		}
	}

	ghost_drop_event (from_card, to_stack) {
		if(!from_card || ! to_stack) return
		this.setState({
			ghost_dragging: false
		})
		if (this.is_valid_drop(from_card, to_stack)) {
			drag_counter = 0 
			var a = PON_from_action({
				from_stack: from_card.name,
				to_stack: to_stack
			})
			this.state.ghost_cards.push(PON_from_card(from_card))
			this.game_update_handler(action_PON(a, this.state.timer_red, this.state.timer_black), false, true)
			if(this.state.moves_counter === 0) {
				a = PON_from_action({
					from_stack: this.state.turn+"stock",
					to_stack:  this.state.turn+"discard",
				})
				this.state.ghost_cards.push(PON_from_card(this.state[this.state.turn+"stock"][this.state[this.state.turn+"stock"].length-1] ))
				this.game_update_handler(action_PON(a, this.state.timer_red, this.state.timer_black), false, true)
			}
		
		}
		else 	
			document.getElementById(PON_from_card(this.state.ghost_dragging)).style.opacity = 1
	}

	drop_event(from_card, to_stack) {
		if(!from_card || ! to_stack) return
		this.setState({
			dragging_over: "",
			dragging: false
		})
		drag_counter = 0
		if (from_card.name != to_stack) {
			if( (this.props.red.username === "AI" && this.state.turn == "red") || ( this.props.black.username === "AI" && this.state.turn === "black") )
				socket.emit("game_action", from_card.name, to_stack)
			else
				if (this.is_valid_drop(from_card, to_stack))
					socket.emit("game_action", from_card.name, to_stack)
		}
	}

	drag_event(event) {
		if(this.state.ghost_dragging) {
			document.getElementById(PON_from_card(this.state.ghost_dragging)).style.opacity = 1
			this.setState({ghost_dragging : false})
		}
		if (event.type === "dragenter") {
			drag_counter++
		}
		if (event.type === "dragleave") {
			drag_counter--
		}
		if (drag_counter === 0)
			this.setState({
				dragging_over: ""
			})
		else
			this.setState({
				dragging_over: event.target.attributes.data_stack.value
			})
	}

	dragstart_event(card, ghost_move) {
		if(this.state.ghost_cards.length > 0 && !ghost_move) return false
		if(this.state.analysis_board && ! ghost_move) return false
		if (this.state.branched_off && ! ghost_move) return false
		if (this.props.spectator) return false
		if (!card.uppermost  ) return false
		if (!card.faceup) return false
		if (card.name.includes("discard")) return false
		if ((card.name.includes("malus") || card.name.includes("stock")) && ! card.name.includes(this.state.turn)) return false
		if (card.name.includes("reserve") && !card.name.includes(this.state.turn)) return false
		if (! (this.state.turn === this.state.color || ghost_move)) return false
		return true
	}

	statechange_messages(messages) {
		this.setState({
			messages: messages
		})
	}

	statechange_dragging(card, event) {
		if (card) {
			event.target.style.opacity = "0.5"
		} else {
			if(event)
				event.target.style.opacity = "1"
		}
		this.setState({
			dragging: card
		})
	}

	is_valid_drop(from_card, to_stack) {
		if (! (from_card && to_stack))
			return false
		if (this.state[to_stack].length > 0)
			var to_card = this.state[to_stack][this.state[to_stack].length - 1]
		if (this.state.turn_counter === 0 && from_card.name.includes("malus"))
			return false
		if(from_card.name.includes("malus") && ! (to_stack.includes("tableau") || to_stack.includes("foundation")) )
			return false
		if (to_stack.includes("reserve")) {
			if (to_card)
				return false
			if(! (from_card.name.includes("tableau")))
				return false
			if (!to_stack.includes(this.state.turn))
				return false
			return true
		}
		if (to_stack.includes("stock"))
			return false
		if (to_stack.includes("discard")) {
			if( to_stack.includes(this.state.turn))
				return true
			if(this.state.turn_counter === 0)
				return false
			if(! (from_card.name.includes("tableau")))
				return false
			if (to_card === undefined) 
				return true
			if(from_card.suit != to_card.suit && to_card.value === from_card.value)
				return true
			if (from_card.suit === to_card.suit) {
				if (from_card.value === to_card.value + 1 || from_card.value === to_card.value - 1)
					return true
				if( (from_card.value  === 13 && to_card.value === 1 ) || (from_card.value  === 1 && to_card.value === 13 ) )
					return true
				return false		
			}
			return false
		}
		if (to_stack.includes("malus")) {
			if ( ! to_stack.includes(this.state.turn) && this.state.turn_counter === 0) 
				return false
			if(! (from_card.name.includes("tableau")))
				return false
			if (to_card === undefined) 
				return true
			if(from_card.suit != to_card.suit && to_card.value === from_card.value)
				return true
			if (from_card.suit === to_card.suit) {
				if (from_card.value === to_card.value + 1 || from_card.value === to_card.value - 1)
					return true
				if( (from_card.value  === 13 && to_card.value === 1 ) || (from_card.value  === 1 && to_card.value === 13 ) )
					return true
				return false		
			}
			return false
		}
		if (to_stack.includes("foundation")) {
			if(from_card.name.includes("foundation"))
				return false
			if (to_card != undefined) {
				if (from_card.suit === to_card.suit)
					if (from_card.value - 1 === to_card.value)
						return true
			} 
			else if (from_card.value === 1)
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
			} 
			else
				return true
			return false
		}
	}

	stack_color(stack_name) {
		var defaultColor1 = "#f1debe"
		var dragging = "#bdb191"
		var regular_move = "#9bb3de"
		var discard_move = "#778191"
		var free_move = "#cce2ff"
		var player_turn = "#75d975"
		var player_turn_discard ="#4a8f4a"
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

			if (stack_name === this.state.dragging_over && this.state.dragging_over && this.is_valid_drop(this.state.dragging, this.state.dragging_over)) {
				if((this.state.dragging.name.includes("stock") && stack_name != this.state.turn+"discard") ||  stack_name.includes("foundation") )
					return dragging_over_free
				if(stack_name === this.state.color+"discard")
					return dragging_over_discard
				else
					return dragging_over_regular
			}

			if(this.state.ghost_dragging && this.is_valid_drop(this.state.ghost_dragging, stack_name)) {
				if((this.state.ghost_dragging.name.includes("stock")&& stack_name != this.state.turn+"discard") || stack_name.includes("foundation") )
					return free_move
				if(stack_name === this.state.color+"discard")
					return discard_move
				else
					return regular_move
			}

			if(this.state.dragging && this.is_valid_drop(this.state.dragging, stack_name)) {
				if((this.state.dragging.name.includes("stock")&& stack_name != this.state.turn+"discard") || stack_name.includes("foundation") )
					return free_move
				if(stack_name === this.state.color+"discard")
					return discard_move
				else
					return regular_move
			}
			else 
			if (this.state.turn === this.state.color && ((stack_name === this.state.color + "reserve") || stack_name === this.state.color + "malus")) {
				color = player_turn
				if (!this.state.dragging && this.state.last_moved1 === stack_name)
					color =   last_move_from
				else if( !this.state.dragging && this.state.last_moved2 === stack_name)
					color =   last_move_to
				if (this.state.dragging ? this.state.dragging.name === stack_name : false)
					color = player_turn_discard
			}
			else {
				if ( stack_name.includes("reserve") || stack_name.includes("malus")) {
					if ((stack_name.includes(this.state.color) && this.state.turn != this.state.color) || (!stack_name.includes(this.state.color) && this.state.turn === this.state.color)) {
						color = grey
					} else {
						color = enemy_turn
					}
				} 
			else {
				color = defaultColor1
			}
			if (!this.state.dragging &&this.state.last_moved1 === stack_name)
				color =   last_move_from
			else if( !this.state.dragging &&this.state.last_moved2 === stack_name)
				color =   last_move_to
			if (this.state.dragging ? this.state.dragging.name === stack_name : false)
					color = dragging
			}
			
			return color
		}
		return false
	}

	replay_next = () => {
		if(this.state.ghost_dragging)
			document.getElementById(PON_from_card(this.state.ghost_dragging)).style.opacity = 1
		this.setState({
			dragging : false,
			ghost_dragging : false
		})
		if (this.state.replay_step >= this.state.game_states.length) {
			return
		}
		var new_state = game_from_PON(this.state.game_states[this.state.replay_step])
		this.setState(new_state)
		this.state.last_moved1 =  stack_names_from_PON(this.state.actions[this.state.replay_step].a)[0]
		this.state.last_moved2 =  stack_names_from_PON(this.state.actions[this.state.replay_step ].a)[1]
		this.state.replay_step = this.state.replay_step + 1
		if (this.state.replay_step != this.state.game_states.length) {
			this.state.branched_off = true
		} else {
			if (!this.props.analysis_board) {
				var val = (new Date() - this.state.last_action) / 1000
				this.setState({
					["timer_" + new_state.turn]: new_state["timer_" + new_state.turn] - val
				})
				if (this.state.time_control === "hourglass") {
					this.setState({
						["timer_" + (new_state.turn === "red" ? "black" : "red")]: new_state["timer_" + (new_state.turn === "red" ? "black" : "red")] + val
					})
				}
			} else {
				this.setState({
					["timer_" + new_state.turn]: this.state.actions[this.state.actions.length - 1]["timer_" + new_state.turn]
				})
				if (this.state.time_control === "hourglass")
					this.setState({
						["timer_" + (new_state.turn === "red" ? "black" : "red")]: this.state.actions[this.state.actions.length - 1]["timer_" + (new_state.turn === "red" ? "black" : "red")]
					})
			}
			this.state.branched_off = false
		}
	}

	replay_back = () => {
		if(this.state.ghost_dragging)
			document.getElementById(PON_from_card(this.state.ghost_dragging)).style.opacity = 1
		this.setState({
			dragging : false,
			ghost_dragging : false
		})
		this.state.ghost_cards.length = 0
		if (this.state.replay_step - 1 === -1) {
			return
		}
		if (this.state.replay_step - 1 === 0) {
			this.setState(game_from_PON(this.props.game_PON))
			this.state.last_moved1 = false
			this.state.last_moved2  = false
		}
		if (this.state.replay_step - 1 > 0) {
			this.setState(game_from_PON(this.state.game_states[this.state.replay_step - 2]))
			this.state.last_moved1 =  stack_names_from_PON(this.state.actions[this.state.replay_step -2].a)[0]
			this.state.last_moved2 =  stack_names_from_PON(this.state.actions[this.state.replay_step -2].a)[1]
		}
		this.state.replay_step = this.state.replay_step - 1
		if (this.state.replay_step != this.state.game_states.length)
			this.state.branched_off = true
	}

	replay_slider = (e) => {
		this.state.ghost_cards.length = 0
		var val = e.target.value
		var rep = this.state.replay_step

		if (rep < val) {
			for (var i = 0; i < val - rep; i++)
				this.replay_next()
		}
		if (val < rep) {
			for (var i = 0; i < rep - val; i++)
				this.replay_back()
		}
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
						leftclick_event : this.leftclick_event,
						rightclick_event : this.rightclick_event
						}, "")
				)
			}
		}
		return React.createElement('div', {
				id: "Game",
				onMouseDown : e => {
					if(e.buttons === 4 || e.buttons === 1) {
						if(this.state.ghost_cards.length > 0) {
							if(e.buttons === 4)
								this.setState({
									dragging: false
								})
							this.setState({
								ghost_dragging: false
							})
			
							if(this.state.game_states.length > 0) {
								if(this.state.replay_step > 0) {
									this.setState(game_from_PON(this.state.game_states[this.state.replay_step-1 ]))
									var action = stack_names_from_PON(this.state.actions[this.state.replay_step-1].a)
									this.setState({
										last_moved1 : action[0],
										last_moved2 : action[1]
									})
								}
								else {
									this.setState(game_from_PON(this.props.game_PON))
									this.setState({
										last_moved1 : false,
										last_moved2 : false,
									})
								}
								
							}
							else {
								this.setState(game_from_PON(this.props.game_PON))
								this.setState({
									last_moved1 : false,
									last_moved2 : false,
								})
							}

							
							if (!this.props.analysis_board) {
								var val = (new Date() - this.state.last_action) / 1000
								this.setState({
									["timer_" + this.state.turn]: this.state["timer_" + this.state.turn] 
								})
								if (this.state.time_control === "hourglass") {
									this.setState({
										["timer_" + (this.state.turn === "red" ? "black" : "red")]: this.state["timer_" + (this.state.turn === "red" ? "black" : "red")] + val
									})
								}
							} else {
								this.setState({
									["timer_" + this.state.turn]: this.state.actions[this.state.actions.length - 1]["timer_" + this.state.turn]
								})
								if (this.state.time_control === "hourglass")
									this.setState({
										["timer_" + (this.state.turn === "red" ? "black" : "red")]: this.state.actions[this.state.actions.length - 1]["timer_" + (this.state.turn === "red" ? "black" : "red")]
									})
							}

							for(var c of this.state.ghost_cards) {
								if(document.getElementById(c) )
									document.getElementById(c).style.opacity = 1
							}
						
							this.state.ghost_cards.length = 0
						}
					}
				},
				style: {
					fontFamily : "sans-serif",
					width: "120vmax",
					height: "100vmax"
				}
			},
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
			},this.props[this.state.color].elo ? this.props[this.state.color].elo : ""),

			!(this.props.spectator || this.props.analysis_board) ? React.createElement("button", {
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
			this.props.spectator ?  React.createElement("button", {
				style: {
					position: "absolute",
					top: "99vmin",
					left: "20vmin",
				},
				onClick: () => {
					socket.emit("spectator_leave")
				}
			}, "leave"): "",
			this.props.analysis_board ?  React.createElement("button", {
				style: {
					position: "absolute",
					top: "99vmin",
					left: "20vmin",
				},
				onClick: () => {
					this.props.end_analysis_board()
				}
			}, "leave") : "",
			this.props.spectator || this.props.analysis_board ? React.createElement("button", {
				style: {
					position: "absolute",
					top: "99vmin",
					left: "91.5vmin",
				},
				onClick: () => {
					this.setState({
						color: this.state.color === "red" ? "black" : "red"
					})
				},
			}, "change color") : "",
			!(this.props.spectator || this.props.analysis_board) ? React.createElement("button", {
				style: {
					position: "absolute",
					top: "99vmin",
					left: "10vmin",
				},
				onClick: () => {
					this.setState({
						show_chat: !this.state.show_chat
					})
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
				style : {
					position: 'absolute',
					top: "47.5vmin" ,
					left: this.state.moves_counter >= 10 ? "49.5vmax" :  "50.7vmax",
					fontSize: "1.1vmax",
				}
			},React.createElement("b",{},this.state.moves_counter)),
			this.state.timer_red != undefined ? React.createElement(Timer, {
				player: this.state.color === "red" ? true : false,
				time: this.state.timer_red
			}) : "",
			this.state.timer_black != undefined ? React.createElement(Timer, {
				player: this.state.color === "black" ? true : false,
				time: this.state.timer_black
			}) : "",
			components,
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
					min: "0",
					max: this.state.game_states.length,
					value: this.state.replay_step,
					className: "slider",
					id: "myRange",
					onChange: (e) => {
						this.replay_slider(e)
					}
				}),
			),
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

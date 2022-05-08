var to_sns
var from_sns
var tableaunames = [
	"redtableau0",
	"redtableau1",
	"redtableau2",
	"redtableau3",
	"blacktableau0",
	"blacktableau1",
	"blacktableau2",
	"blacktableau3"
]

function weight(game, branch) {
	var points = 0
	if (game[game.turn + "malus"].length === 0 && game[game.turn + "reserve"].length === 0) {
		points += 9999999
	}
	if (game[game.turn + "reserve"].length != 0)
		points -= 250
	if (game[game.turn + "stock"].length + game[game.turn + "discard"].length === 0)
		points -= 500
	points += game[(game.turn === "red" ? "black" : "red") + "malus"].length
	points += game.redfoundation0.length * 0.2
	points += game.redfoundation1.length * 0.2
	points += game.redfoundation2.length * 0.2
	points += game.redfoundation3.length * 0.2
	points += game.blackfoundation0.length * 0.2
	points += game.blackfoundation1.length * 0.2
	points += game.blackfoundation2.length * 0.2
	points += game.blackfoundation3.length * 0.2
	for (var name of tableaunames) {
		if (game[name].length > 0) {
			points += game[name][game[name].length - 1].value === 1 ? -50 : 0
			game.turn = game.turn === "red" ? "black" : "red"
			var actions_from_stack = actions_fromstack(game, name)
			if (actions_from_stack.find(a => a[1].includes("foundation")))
				points -= 350
			if (game[name].length === 1)
				if (actions_from_stack.length > 0)
					points -= 350
			game.turn = game.turn === "red" ? "black" : "red"
		}

		points += game[name].length < 3 ? -100 : 0
		points += game[name].length * 0.1
		points += game[name].length === 0 ? -500 : 0
	}
	if (actions_fromstack(game, game.turn + "stock").find(a => a[1].includes("foundation")))
		points -= 350
	game.turn = game.turn === "red" ? "black" : "red"
	points -= 150 * actions_fromstack(game, game.turn + "malus").length
	points -= 1 * actions_tostack(game, (game.turn === "red" ? "black" : "red") + "discard").length
	points -= 150 * actions_tostack(game, (game.turn === "red" ? "black" : "red") + "malus").length
	game.turn = game.turn === "red" ? "black" : "red"
	for (var a of branch) {
		if (a[0].includes("malus"))
			points += 300
		if (a[1] === game.turn + "malus")
			points -= 300
		if (a[0].includes("foundation"))
			points -= 35
		if (a[1].includes("foundation"))
			points += 33
	}
	return points + generateRandomInteger(-10, 10) * 0.1
}

function generateRandomInteger(min, max) {
	return Math.floor(min + Math.random() * (max + 1 - min))
}

function actions_fromstack(game, from_stack) {
	var from_up_c = game[from_stack][game[from_stack].length - 1]
	var actions = []
	if (!from_up_c) return []
	for (var to_stack of to_sns) {
		if (valid_d(game, from_stack, from_up_c, to_stack)) {
			actions.push([from_stack, to_stack])
		}
	}
	return actions
}

function actions_tostack(game, to_stack) {
	var actions = []
	if (!from_up_c) return []
	for (var from_stack of from_sns) {
		if (game[from_stack].length > 0)
			var from_up_c = game[from_stack][game[from_stack].length - 1]
		if (valid_d(game, from_stack, from_up_c, to_stack)) {
			actions.push([from_stack, to_stack])
		}
	}
	return actions
}

export function weighted_action_sequences(game, board_states) {
	var board_states = []
	to_sns = to_stacknames(game.turn)
	from_sns = from_stacknames(game.turn)
	actions_from(game, board_states, [])
	var highest
	board_states = board_states.filter(state => state.b.length != 0 && (game.moves_counter === 0 || state.b[state.b.length - 1][1] === game.turn + "discard"))
	for (var s of board_states) {
		if (highest) {
			if (s.w > highest.w)
				highest = s
			else if (s.w === highest.w)
				if (s.b.length < highest.b.length)
					highest = s
		} else
			highest = s
	}
	console.log(board_states)
	return highest
}

function actions_from(game, board_states, branch) {
	if (board_states.length > 5000)
		return false
	var open_actions = []
	for (var i = 0; i < branch.length; i++) {
		var index = open_actions.findIndex(a => a[0][0] === branch[i][0] || a[0][0] === branch[i][1] || a[0][1] === branch[i][0] || a[0][1] === branch[i][1])
		if (index != -1) {
			open_actions[index] = [branch[i], i]
			continue
		}
		open_actions.push([branch[i], i])
	}

	for (var from_stack of from_sns)
		actions_from_to(game, from_stack, board_states, branch, open_actions)
}

function actions_from_to(game, from_stack, board_states, branch, open_actions) {
	var from_up_c = game[from_stack][game[from_stack].length - 1]
	if (!from_up_c) return []
	for (var to_stack of to_sns) {
		if (open_actions.find(a => a[0][1] === from_stack))
			continue
		if (valid_d(game, from_stack, from_up_c, to_stack)) {
			var cloned_game = apply_action_to_game(JSON.parse(JSON.stringify(game)), from_stack, to_stack)
			var boardpon = boardPON(cloned_game)
			var index = board_states.findIndex(o => o.p === boardpon)
			if (index === -1) {
				var cloned_branch = JSON.parse(JSON.stringify(branch))
				cloned_branch.push([from_stack, to_stack])
				board_states.push({
					b: cloned_branch,
					w: weight(cloned_game, cloned_branch),
					p: boardpon
				})
				if (cloned_game.moves_counter > 0 && to_stack != game.turn + "discard")
					actions_from(cloned_game, board_states, cloned_branch, to_stacknames(cloned_game.turn), from_stacknames(cloned_game.turn))
			}

		}
	}
}

function boardPON(game) {
	var pon = []
	for (var cards_of_stack of Object.values(game)) {
		pon.push(PON_from_card(cards_of_stack[cards_of_stack.length - 1]))
	}
	return pon.sort().toString()+game.moves_counter
}



export function PON_from_card(c) {
	if (!c) return ""
	var cp = ""
	cp += !c.faceup ? c.color === "red" ? "R" : "B" : c.color === "red" ? "r" : "b"
	cp += c.suit ? c.suit[0] : ""
	cp += c.value ? (c.value < 10 ? c.value : c.value === 10 ? "t" : c.value === 11 ? "j" : c.value === 12 ? "q" : "k") : ""
	return cp
}

function valid_d(game, from_stack, from_card, to_stack) {
	if (!(from_card && to_stack))
		return false
	if (game[to_stack].length > 0)
		var to_card = game[to_stack][game[to_stack].length - 1]
	if (to_stack.includes("tableau") && game[from_stack].length === 1 && game[to_stack].length === 0)
		return false
	if (game.turn_counter === 0 && from_stack.includes("malus"))
		return false
	if (from_stack.includes("malus") && !(to_stack.includes("tableau") || to_stack.includes("foundation")))
		return false
	if (to_stack.includes("reserve")) {
		if (to_card)
			return false
		if (!(from_stack.includes("tableau")))
			return false
		if (!to_stack.includes(game.turn))
			return false
		return true
	}
	if (to_stack.includes("stock"))
		return false
	if (to_stack.includes("discard")) {
		if (from_card.value === 1)
			return false
		if (to_stack.includes(game.turn)) {
			if (from_stack.includes("tableau") || from_stack.includes("stock"))
				return true
			else
				return false
		}
		if (game.turn_counter === 0)
			return false
		if (!from_stack.includes("tableau"))
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
		if (!to_stack.includes(game.turn) && game.turn_counter === 0)
			return false
		if (!(from_stack.includes("tableau")))
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
		if (from_stack.includes("foundation"))
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

function apply_action_to_game(game, from, to) {
	game[to].push(game[from].pop())
	if (!to.includes("foundation") && !from.includes("stock"))
		game.moves_counter = game.moves_counter - 1
	return game
}

function to_stacknames(turn) {
	return [
		"redtableau0",
		"redtableau1",
		"redtableau2",
		"redtableau3",
		"blacktableau0",
		"blacktableau1",
		"blacktableau2",
		"blacktableau3",
		"redfoundation0",
		"redfoundation1",
		"redfoundation2",
		"redfoundation3",
		"blackfoundation0",
		"blackfoundation1",
		"blackfoundation2",
		"blackfoundation3",
		(turn === "red" ? "black" : "red") + "malus",
		(turn === "red" ? "black" : "red") + "discard",
		turn + "reserve",
		(turn) + "discard",
	]
}

function from_stacknames(turn) {
	return [
		"redtableau0",
		"redtableau1",
		"redtableau2",
		"redtableau3",
		"blacktableau0",
		"blacktableau1",
		"blacktableau2",
		"blacktableau3",
		turn + "stock",
		"redfoundation0",
		"redfoundation1",
		"redfoundation2",
		"redfoundation3",
		"blackfoundation0",
		"blackfoundation1",
		"blackfoundation2",
		"blackfoundation3",
		turn + "reserve",
		turn + "malus",

	]
}
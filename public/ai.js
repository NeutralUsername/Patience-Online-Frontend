
var to_sns
var from_sns
function weight(game) {
  var  points = 0
	if(game[game.turn+"malus"].length === 0 && game[game.turn+"reserve"].length === 0) {
		return 999999
	}	
	if( game[game.turn+"reserve"].length != 0)
		points -= 1000
	points -= empty_tableau(game)*100
	points += game[(game.turn === "red" ? "black" : "red") +"malus"].length
	points -= game[game.turn  +"malus"].length*100
	for(var i = 0; i< 2; i++) {
		for(var j = 0; j < 4; j++) {
			points += 1* game[(i === 0? "red" :"black") + "foundation"+j].length
			points += 0.9*game[(i === 0? "red" :"black") + "tableau"+j].length
		}
	}
  return points
}

export function weighted_action_sequences(game, board_states) {
	var board_states =  []
	to_sns = to_stacknames(game.turn)
	from_sns = from_stacknames(game.turn)
	actions_from(game, board_states, [])
	console.log(board_states)
	return []
}

function actions_from (game, board_states, branch) {
	var open_actions = []
	for(var i = 0; i < branch.length; i++) { 
		var index = open_actions.findIndex( a => a[0][0] === branch[i][0] || a[0][0] === branch[i][1] || a[0][1] === branch[i][0] || a[0][1] === branch[i][1])
		if(index != -1 ) 
			open_actions.splice(index,1)
		open_actions.push([branch[i],i])
	}

	for(var from_stack of from_sns) 
		actions_from_to(game, from_stack, board_states, branch, open_actions)
}

function actions_from_to(game, from_stack, board_states, branch, open_actions) {
	var from_up_c = game[from_stack][game[from_stack].length-1]
	if(!from_up_c ) return []
	for(var to_stack of to_sns) {
		if( open_actions.find(a=>a[0][1] === from_stack )) 
			continue
		if(valid_d(game, from_stack, from_up_c, to_stack )) { 
			var cloned_game = apply_action_to_game(structuredClone(game), from_stack, to_stack)
			var g_w_actionPON =	boardPON(cloned_game)
			
			var index = board_states.findIndex(o => o.p === g_w_actionPON)
			if( index > -1) {
				if( board_states[index].b.length > branch.length) {
					var cloned_branch  = structuredClone(branch)
					cloned_branch.push([from_stack, to_stack])
					board_states.splice(index,1)
					board_states.push({
						b : cloned_branch, 
						w : weight(cloned_game),
						p : g_w_actionPON
					})
					if(cloned_branch.length < 5  && to_stack != game.turn+"discard" )
						actions_from(cloned_game, board_states, cloned_branch,  to_stacknames(cloned_game.turn), from_stacknames(cloned_game.turn))
				}
			}
			else {
				var cloned_branch  = structuredClone(branch)
				cloned_branch.push([from_stack, to_stack])
				board_states.push({
					b : cloned_branch, 
					w : weight(cloned_game),
					p : g_w_actionPON
				})
				if(cloned_branch.length <5 && to_stack != game.turn+"discard" )
					actions_from(cloned_game, board_states, cloned_branch,  to_stacknames(cloned_game.turn), from_stacknames(cloned_game.turn))
			}
		}
	}
}

function valid_d(game, from_stack, from_card, to_stack) {
	if (! (from_card && to_stack))
		return false
 	if(to_stack.includes("tableau") && game[from_stack].length === 1 && game[to_stack].length === 0) return false
	if(from_stack.includes("foundation") && to_stack.includes("foundation")) return false
	if (game[to_stack].length > 0)
		var to_card = game[to_stack][game[to_stack].length-1]

	if (to_stack.includes("reserve")) {
		if(from_stack.includes("malus"))
			return false
		if (to_card && to_stack.includes("reserve"))
			return false
		if (to_stack.includes("reserve") && !to_stack.includes(game.turn))
			return false
		return true
	}
	if (to_stack.includes("stock"))
		return false
	if (to_stack.includes("discard")) {
		if(to_stack.includes(game.turn))
			return true
		if (game[game.turn+"discard"].length === 0) 
			return false
		if( from_stack.includes("foundation"))
			return false
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
		if(! to_stack.includes(game.turn) && game[game.turn+"discard"].length === 0) 
			return false
		if( from_stack.includes("foundation"))
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
	return game
}

export function PON_from_card(c) {
	if(!c) return ""
	var cp = ""
	cp +=  ! c.faceup ? c.color === "red" ? "R" : "B" : "" 
	cp += c.suit ? c.suit[0] : ""
	cp += c.value ? (c.value < 10 ? c.value : c.value === 10 ? "t" : c.value === 11 ? "j" : c.value === 12 ? "q" : "k") : ""
	return cp
}

function empty_tableau(g) {
	var count = 0
	if(g.redtableau0.length === 0)
		count++
	if(g.redtableau1.length === 0)
		count++
	if(g.redtableau2.length === 0)
		count++
	if(g.redtableau3.length === 0)
		count++
	if(g.blacktableau0.length === 0)
		count++
	if(g.blacktableau1.length === 0)
		count++
	if(g.blacktableau2.length === 0)
		count++
	if(g.blacktableau3.length === 0)
		count++
	return count
}

function boardPON(game) {
	var stacks = []
	var tabl = []
	var foun = []
	for (var stack_key of Object.keys(game)) {
		if (stack_key === "redmalus" || stack_key === "blackmalus" ||
			stack_key === "redstock" || stack_key === "blackstock" ||
			stack_key === "reddiscard" || stack_key === "blackdiscard" ||
			stack_key === "redreserve" || stack_key === "blackreserve" ||
			stack_key === "redtableau0" || stack_key === "blacktableau0" ||
			stack_key === "redtableau1" || stack_key === "blacktableau1" ||
			stack_key === "redtableau2" || stack_key === "blacktableau2" ||
			stack_key === "redtableau3" || stack_key === "blacktableau3" ||
			stack_key === "redfoundation0" || stack_key === "blackfoundation0" ||
			stack_key === "redfoundation1" || stack_key === "blackfoundation1" ||
			stack_key === "redfoundation2" || stack_key === "blackfoundation2" ||
			stack_key === "redfoundation3" || stack_key === "blackfoundation3") {
			if(stack_key.includes("tableau"))
				tabl.push(PON_from_card(game[stack_key][game[stack_key].length -1]))
			else if(stack_key.includes("foundation"))
				foun.push(PON_from_card(game[stack_key][game[stack_key].length -1]))
			else stacks.push(PON_from_card(game[stack_key][game[stack_key].length -1]))
		}
	}
	
	return tabl.sort().toString()+","+foun.sort().toString()+","+stacks.toString()
}

function to_stacknames(turn) {
	return [
		(turn === "red" ? "black" : "red") + "malus",
		(turn === "red" ? "black" : "red") + "discard",
		(turn ) + "discard",
		"redfoundation0",
		"redfoundation1",
		"redfoundation2",
		"redfoundation3",
		"blackfoundation0",
		"blackfoundation1",
		"blackfoundation2",
		"blackfoundation3",
		"redtableau0",
		"redtableau1",
		"redtableau2",
		"redtableau3",
		"blacktableau0",
		"blacktableau1",
		"blacktableau2",
		"blacktableau3",
		turn + "reserve",
	]
}

function from_stacknames (turn) {
	return [
		turn+"stock",
		turn+"reserve",
		turn+"malus",
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
	]
}

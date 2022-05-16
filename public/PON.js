export function game_from_PON(PON) {
	var status = PON.substring(PON.indexOf("(") + 1, PON.indexOf(")")).split(",");
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
		moves_counter: Number(status[0]),
		timer_red: Number(status[1]),
		timer_black: Number(status[2]),
		increment: Number(status[3]),
		turn_counter: Number(status[4]),
		turn: status[5],
	}
	var board = PON.substring(PON.indexOf("{") + 1, PON.indexOf("}")).split("/")
	for (var i = 0; i < board.length; i++) {
		var stack = board[i].split("-")

		for (var c of stack) {
			if (c.length === 0 || c[0] === "") continue
			var card = {}
			if (c.length === 1) {
				if ((c[0] === "R" || c[0] === "B")) {
					card.color = c[0] === "R" ? "red" : "black"
					card.faceup = false
				}
			} else {
				if (c[0] === "R" || c[0] === "B")
					card.faceup = false
				else
					card.faceup = true
				if (c[0] === "r" || c[0] === "R")
					card.color = "red"
				if (c[0] === "b" || c[0] === "B")
					card.color = "black"
				switch (c[1]) {
					case "h":
						card.suit = "hearts";
						break
					case "s":
						card.suit = "spades";
						break
					case "d":
						card.suit = "diamonds";
						break
					case "c":
						card.suit = "clubs";
						break
				}
				switch (c[2]) {
					case "1":
						card.value = 1;
						break
					case "2":
						card.value = 2;
						break
					case "3":
						card.value = 3;
						break
					case "4":
						card.value = 4;
						break
					case "5":
						card.value = 5;
						break
					case "6":
						card.value = 6;
						break
					case "7":
						card.value = 7;
						break
					case "8":
						card.value = 8;
						break
					case "9":
						card.value = 9;
						break
					case "t":
						card.value = 10;
						break
					case "j":
						card.value = 11;
						break
					case "q":
						card.value = 12;
						break
					case "k":
						card.value = 13;
						break
				}
			}
			switch (i) {
				case 0:
					game.redmalus.push(card);
					break
				case 1:
					game.redstock.push(card);
					break
				case 2:
					game.reddiscard.push(card);
					break
				case 3:
					game.redreserve.push(card);
					break
				case 4:
					game.redtableau0.push(card);
					break
				case 5:
					game.redtableau1.push(card);
					break
				case 6:
					game.redtableau2.push(card);
					break
				case 7:
					game.redtableau3.push(card);
					break
				case 8:
					game.redfoundation0.push(card);
					break
				case 9:
					game.redfoundation1.push(card);
					break
				case 10:
					game.redfoundation2.push(card);
					break
				case 11:
					game.redfoundation3.push(card);
					break
				case 12:
					game.blackmalus.push(card);
					break
				case 13:
					game.blackstock.push(card);
					break
				case 14:
					game.blackdiscard.push(card);
					break
				case 15:
					game.blackreserve.push(card);
					break
				case 16:
					game.blacktableau0.push(card);
					break
				case 17:
					game.blacktableau1.push(card);
					break
				case 18:
					game.blacktableau2.push(card);
					break
				case 19:
					game.blacktableau3.push(card);
					break
				case 20:
					game.blackfoundation0.push(card);
					break
				case 21:
					game.blackfoundation1.push(card);
					break
				case 22:
					game.blackfoundation2.push(card);
					break
				case 23:
					game.blackfoundation3.push(card);
					break
			}
		}
	}
	return game
}

export function stack_names_from_PON(action_PON) {
	var stack_names = []
	action_PON = action_PON.split(/(.{2})/).filter(x => x.length == 2)

	for (var stack_name of action_PON) {
		switch (stack_name) {
			case "rs":
				stack_names.push("redstock");
				break
			case "rd":
				stack_names.push("reddiscard");
				break
			case "rr":
				stack_names.push("redreserve");
				break
			case "rm":
				stack_names.push("redmalus");
				break

			case "r1":
				stack_names.push("redtableau0");
				break
			case "r2":
				stack_names.push("redtableau1");
				break
			case "r3":
				stack_names.push("redtableau2");
				break
			case "r4":
				stack_names.push("redtableau3");
				break

			case "r6":
				stack_names.push("redfoundation0");
				break
			case "r7":
				stack_names.push("redfoundation1");
				break
			case "r8":
				stack_names.push("redfoundation2");
				break
			case "r9":
				stack_names.push("redfoundation3");
				break

			case "bs":
				stack_names.push("blackstock");
				break
			case "bd":
				stack_names.push("blackdiscard");
				break
			case "br":
				stack_names.push("blackreserve");
				break
			case "bm":
				stack_names.push("blackmalus");
				break

			case "b1":
				stack_names.push("blacktableau0");
				break
			case "b2":
				stack_names.push("blacktableau1");
				break
			case "b3":
				stack_names.push("blacktableau2");
				break
			case "b4":
				stack_names.push("blacktableau3");
				break

			case "b6":
				stack_names.push("blackfoundation0");
				break
			case "b7":
				stack_names.push("blackfoundation1");
				break
			case "b8":
				stack_names.push("blackfoundation2");
				break
			case "b9":
				stack_names.push("blackfoundation3");
				break
		}
	}
	return stack_names
}

export function actions_from_PON(PON) {
	if (PON === "") return []
	var actions = PON.split(",")
	for (var i = 0; i < actions.length; i++) {
		if (stack_names_from_PON(actions[i]).length === 0) return []
		actions[i] = action_from_PON(actions[i])
	}
	return actions
}

export function action_from_PON(action_PON) {
	var action = {}
	action_PON = action_PON.split(":")
	action.a = action_PON[0]
	action.timer_red = Number(action_PON[1])
	action.timer_black = Number(action_PON[2])
	return action
}

export function card_from_PON(card_PON) {
	if (!card_PON) return ""
	var card = {}
	card.color = (card_PON[0] === "r" || card_PON[0] === "R") ? "red" : "black"
	card.suit = card_PON[1] === "h" ? "hearts" : card_PON[1] === "s" ? "spades" : card_PON[1] === "d" ? "diamonds" : card_PON[1] === "c" ? "clubs" : ""
	switch (card_PON[2]) {
		case "1":
			card.value = 1;
			break
		case "2":
			card.value = 2;
			break
		case "3":
			card.value = 3;
			break
		case "4":
			card.value = 4;
			break
		case "5":
			card.value = 5;
			break
		case "6":
			card.value = 6;
			break
		case "7":
			card.value = 7;
			break
		case "8":
			card.value = 8;
			break
		case "9":
			card.value = 9;
			break
		case "t":
			card.value = 10;
			break
		case "j":
			card.value = 11;
			break
		case "q":
			card.value = 12;
			break
		case "k":
			card.value = 13;
			break
		default:
			card.value = "";
			break
	}
	if (card_PON[0] === "R" || card_PON[0] === "B")
		card.faceup = false
	else card.faceup = true
	return card
}

export function PON_from_card(card) {
	var card_PON = ""
	card_PON += card.color ? (card.color === "red" ? card.faceup ? "r" : "R" : card.faceup ? "b" : "B") : ""
	card_PON += card.suit ? card.suit[0] : ""
	card_PON += card.value ? (card.value < 10 ? card.value : card.value === 10 ? "t" : card.value === 11 ? "j" : card.value === 12 ? "q" : "k") : ""
	return card_PON
}

export function PON_from_action(action) {
	var PON = ""
	for (var i = 0; i < 2; i++) {
		switch (i === 0 ? action.from_stack : action.to_stack) {
			case "redstock":
				PON += "rs";
				break
			case "reddiscard":
				PON += "rd";
				break
			case "redmalus":
				PON += "rm";
				break
			case "redreserve":
				PON += "rr";
				break

			case "redtableau0":
				PON += "r1";
				break
			case "redtableau1":
				PON += "r2";
				break
			case "redtableau2":
				PON += "r3";
				break
			case "redtableau3":
				PON += "r4";
				break

			case "redfoundation0":
				PON += "r6";
				break
			case "redfoundation1":
				PON += "r7";
				break
			case "redfoundation2":
				PON += "r8";
				break
			case "redfoundation3":
				PON += "r9";
				break

			case "blackstock":
				PON += "bs";
				break
			case "blackdiscard":
				PON += "bd";
				break
			case "blackmalus":
				PON += "bm";
				break
			case "blackreserve":
				PON += "br";
				break

			case "blacktableau0":
				PON += "b1";
				break
			case "blacktableau1":
				PON += "b2";
				break
			case "blacktableau2":
				PON += "b3";
				break
			case "blacktableau3":
				PON += "b4";
				break

			case "blackfoundation0":
				PON += "b6";
				break
			case "blackfoundation1":
				PON += "b7";
				break
			case "blackfoundation2":
				PON += "b8";
				break
			case "blackfoundation3":
				PON += "b9";
				break
		}
	}
	return PON
}

export function boardPON_from_game(game, live) {
	var PON = ""
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
			if (live) {
				for (var i = 0; i < game[stack_key].length; i++) {
					if (game[stack_key][i].faceup)
						PON += PON_from_card(game[stack_key][i])
					else PON += (game[stack_key][i].color === "red" ? game[stack_key][i].faceup ? "r" : "R" : game[stack_key][i].faceup ? "b" : "B")
					if (i < game[stack_key].length - 1)
						PON += "-"
				}
			} else
				for (var i = 0; i < game[stack_key].length; i++) {
					PON += PON_from_card(game[stack_key][i])
					if (i < game[stack_key].length - 1)
						PON += "-"
				}
			PON += "/"
		}
	}
	PON = PON.slice(0, PON.length - 1)
	PON += "}"
	return PON
}

export function PON_from_game(game, live) {
	var PON = ""
	PON += "("
	for (var i = 0; i < 7; i++)
		for (var stack_key of Object.keys(game)) {
			if (i === 0)
				if (stack_key === "moves_counter")
					PON += game[stack_key] + ","
			if (i === 1)
				if (stack_key === "timer_red")
					PON += game[stack_key] + ","
			if (i === 2)
				if (stack_key === "timer_black")
					PON += game[stack_key] + ","
			if (i === 3)
				if (stack_key === "increment")
					PON += game[stack_key] + ","
			if (i === 4)
				if (stack_key === "turn_counter")
					PON += game[stack_key] + ","
			if (i === 5)
				if (stack_key === "turn")
					PON += game[stack_key]

		}
	PON += ")"
	PON += "{"
	for (var s = 0; s < 24; s++) {
		for (var stack_key of Object.keys(game)) {
			if ((stack_key === "redmalus" && s === 0) || (stack_key === "blackmalus" && s === 12) ||
				(stack_key === "redstock" && s === 1) || (stack_key === "blackstock" && s === 13) ||
				(stack_key === "reddiscard" && s === 2) || (stack_key === "blackdiscard" && s === 14) ||
				(stack_key === "redreserve" && s === 3) || (stack_key === "blackreserve" && s === 15) ||
				(stack_key === "redtableau0" && s === 4) || (stack_key === "blacktableau0" && s === 16) ||
				(stack_key === "redtableau1" && s === 5) || (stack_key === "blacktableau1" && s === 17) ||
				(stack_key === "redtableau2" && s === 6) || (stack_key === "blacktableau2" && s === 18) ||
				(stack_key === "redtableau3" && s === 7) || (stack_key === "blacktableau3" && s === 19) ||
				(stack_key === "redfoundation0" && s === 8) || (stack_key === "blackfoundation0" && s === 20) ||
				(stack_key === "redfoundation1" && s === 9) || (stack_key === "blackfoundation1" && s === 21) ||
				(stack_key === "redfoundation2" && s === 10) || (stack_key === "blackfoundation2" && s === 22) ||
				(stack_key === "redfoundation3" && s === 11) || (stack_key === "blackfoundation3" && s === 23)) {
				if (live) {
					if (stack_key === "redmalus" || stack_key === "blackmalus" || stack_key.includes("tableau0") || stack_key.includes("tableau1") || stack_key.includes("tableau2") || stack_key.includes("tableau3"))
						for (var i = 0; i < game[stack_key].length; i++) {
							if (game[stack_key][i].faceup)
								PON += PON_from_card(game[stack_key][i])
							else PON += (game[stack_key][i].color === "red" ? game[stack_key][i].faceup ? "r" : "R" : game[stack_key][i].faceup ? "b" : "B")
							if (i < game[stack_key].length - 1)
								PON += "-"
						}
					else {
						if (game[stack_key].length > 0) {
							if (game[stack_key][game[stack_key].length - 1].faceup) {
								PON += PON_from_card(game[stack_key][game[stack_key].length - 1])
							} else {
								PON += (game[stack_key][game[stack_key].length - 1].color === "red" ? game[stack_key][game[stack_key].length - 1].faceup ? "r" : "R" : game[stack_key][game[stack_key].length - 1].faceup ? "b" : "B")
							}
						}
					}

				} else
					for (var i = 0; i < game[stack_key].length; i++) {
						PON += PON_from_card(game[stack_key][i])
						if (i < game[stack_key].length - 1)
							PON += "-"
					}
				PON += "/"
			}
		}
	}
	PON = PON.slice(0, PON.length - 1)
	PON += "}"
	return PON
}


export function action_PON(a, tr, tb) {
	var PON = ""
	PON += a
	PON += ":"
	PON += tr
	PON += ":"
	PON += tb
	return PON
}

export function PON_from_actions(actions) {
	var PON = ""
	for (var i = 0; i < actions.length; i++) {
		PON += actions[i]
		if (i != actions.length - 1)
			PON += ","
	}
	return PON
}
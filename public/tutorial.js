export class tutorial extends React.Component {
	constructor(props) {
		super(props)
		this.state = {

		}

	}

	componentWillUnmount() {}

	render() {
		return React.createElement('div', {
				className: "Rules"
			},
			React.createElement("article", {}, React.createElement("b", {}, 'tutorial')),
			React.createElement("a", {
				style: {
					fontSize: "80%"
				},
				href: "",
				onClick: e => {
					e.preventDefault()
					this.props.statechange_content("unranked")
				}
			}, "back"),
			React.createElement("article", {}, '\u00A0'),

			React.createElement("a", {
				href: "https://www.youtube.com/watch?v=mDNJGyw76qQ&t=4s&ab_channel=Charade"
			}, "video guide"),
			React.createElement("article", {}, '\u00A0'),
			React.createElement("article", {}, React.createElement("b", {}, 'The goal of the game is to be the first player to get rid of all your Malus cards.')),
			React.createElement("article", {}, 'The game is played in alternating turns. The starting player is randomly determined.'),
			React.createElement("article", {}, 'Your turn ends after you have moved a card onto your Discard pile.'),
			React.createElement("article", {}, "\u00A0"),
			React.createElement("article", {}, 'The bottom row represents the player side and the top row the opponents side.'),
			React.createElement("article", {}, 'The fields on the bottom row, from left to right, are called: Malus, Reserve, Discard, Stock.'),
			React.createElement("article", {}, 'The top row is mirrored.'),
			React.createElement("article", {}, "\u00A0"),
			React.createElement("article", {}, 'The 8 fields in the middle of your screen, which are empty at the start of the game, are called Foundation.'),
			React.createElement("article", {}, 'Here you can pile up cards of same suit with increasing value: (♥️Ace, ♥️2, ♥️3,......, ♥️10, ♥️Jack,...) '),
			React.createElement("article", {}, "\u00A0"),
			React.createElement("article", {}, 'The 8 fields that surround the Foundation are called Tableau.'),
			React.createElement("article", {}, 'Here you can pile up cards of alternating color and decreasing value: (♠️Jack, ♦️10, ♠️9, ♥️8, ♣️7,.....)'),
			React.createElement("article", {}, "\u00A0"),
			React.createElement("article", {}, 'You can move cards from Tableau onto your opponents Malus and Discard'),
			React.createElement("article", {}, 'if they have same value and different suit or same suit and value of +1 or -1: (♦️5, ♦️4, ♦️3, ♦️4, ♠️4, ♥️4, ♥️5;......)'),
			React.createElement("article", {}, "\u00A0"),
			React.createElement("article", {}, 'The cards are shuffled randomly.'),
			React.createElement("article", {}, 'Kings and Aces are forbidden on Malus.'),
			React.createElement("article", {}, 'You can only move one card at a time.'),
			React.createElement("article", {}, 'You can make 5 moves each turn.'),
			React.createElement("article", {}, 'Moves to Foundation and moves from Stock are excluded from this and free.'),
			React.createElement("article", {}, 'During the first turn you can not move cards to your opponents side.'),
		)
	}
}
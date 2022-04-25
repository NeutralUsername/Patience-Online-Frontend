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
					this.props.statechange_content("normal")
				}
			}, "back"),
			React.createElement("article", {}, '\u00A0'),

			React.createElement("a", {
				href: "https://www.youtube.com/watch?v=VDxy5k0Kggw&ab_channel=Charade"
			}, "video guide"),
			React.createElement("article", {}, '\u00A0'),
			React.createElement("article", {}, React.createElement("b", {}, 'The goal of the game is to be the first player to get rid of all your cards in the green/grey fields on the bottom of your screen')),
			React.createElement("article", {}, 'The game is played in alternating turns. The starting player is randomly determined.'),
			React.createElement("article", {}, 'Your turn ends after 5 moves or after your timer runs up.'),
			React.createElement("article", {}, 'You can end your turn early by moving a card onto your discard.'),
			React.createElement("article", {}, "\u00A0"),
			React.createElement("article", {}, 'The bottom row represents the player side and the top row the opponents side.'),
			React.createElement("article", {}, 'The fields on the bottom row called, from left to right: Malus, Reserve, Discard, Stock'),
			React.createElement("article", {}, 'The top row is mirrored'),
			React.createElement("article", {}, "\u00A0"),
			React.createElement("article", {}, 'The 8 fields in the middle of your screen, which are empty at the start of the game, are called Foundation.'),
			React.createElement("article", {}, 'Here you can pile up cards of the same suit with increasing value: (♥️Ace, ♥️2, ♥️3,......, ♥️10, ♥️Jack,...) '),
			React.createElement("article", {}, "\u00A0"),
			React.createElement("article", {}, 'The 8 fields that surround the Foundation are called Tableau.'),
			React.createElement("article", {}, 'Here you can pile up cards of alternating color and decreasing value: (♠️Jack, ♦️10, ♠️9, ♥️8, ♣️7,.....)'),
			React.createElement("article", {}, "\u00A0"),
			React.createElement("article", {}, 'You can move cards from the Tableau and your Reserve onto the Malus and Discard of your opponent.'),
			React.createElement("article", {}, 'if they have same value and different suit or same suit and a value of +1 or -1: (♦️5, ♦️4, ♦️3, ♦️4, ♠️4, ♥️4, ♥️5;......)'),
			React.createElement("article", {}, "\u00A0"),
			React.createElement("article", {}, 'You can always only move one card at a time.'),
			React.createElement("article", {}, 'Moves from Stock and Moves to Foundation are free.'),
			React.createElement("article", {}, 'During your the turn you can not Move cards from or to Malus and Discard (except to end your turn)'),
			React.createElement("article", {}, "\u00A0"),
			React.createElement("article", {}, 'You can move cards from Tableau to Tableau, Foundation, Discard, Malus and Reserve.'),
			React.createElement("article", {}, 'You can move cards from Stock to Tableau, Foundation, Discard, Malus and Reserve.'),
			React.createElement("article", {}, 'You can move cards from Reserve to Tableau, Foundation, Discard and Malus.'),
			React.createElement("article", {}, 'You can move cards from Malus to Tableau, Foundation and (opponent)Discard.'),
			React.createElement("article", {}, 'You can move cards from Foundation to Tableau and Reserve.'),
		)
	}
}
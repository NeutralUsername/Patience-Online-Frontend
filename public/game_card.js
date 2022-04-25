
export function game_card(props) {
	function card_images() {
		if (!props.faceup)
			if (props.color === 'red') return 'url("https://patienceonlinecards.s3.eu-central-1.amazonaws.com/cards/Card_back_01.svg")'
			else return 'url("https://patienceonlinecards.s3.eu-central-1.amazonaws.com/cards/Card_back_06.svg")'
		else {
			if (props.suit === "spades") {
				if (props.value === 1) return 'url("https://patienceonlinecards.s3.eu-central-1.amazonaws.com/cards/Cards-A-Spade.svg")'
				if (props.value === 2) return 'url("https://patienceonlinecards.s3.eu-central-1.amazonaws.com/cards/Cards-2-Spade.svg")'
				if (props.value === 3) return 'url("https://patienceonlinecards.s3.eu-central-1.amazonaws.com/cards/Cards-3-Spade.svg")'
				if (props.value === 4) return 'url("https://patienceonlinecards.s3.eu-central-1.amazonaws.com/cards/Cards-4-Spade.svg")'
				if (props.value === 5) return 'url("https://patienceonlinecards.s3.eu-central-1.amazonaws.com/cards/Cards-5-Spade.svg")'
				if (props.value === 6) return 'url("https://patienceonlinecards.s3.eu-central-1.amazonaws.com/cards/Cards-6-Spade.svg")'
				if (props.value === 7) return 'url("https://patienceonlinecards.s3.eu-central-1.amazonaws.com/cards/Cards-7-Spade.svg")'
				if (props.value === 8) return 'url("https://patienceonlinecards.s3.eu-central-1.amazonaws.com/cards/Cards-8-Spade.svg")'
				if (props.value === 9) return 'url("https://patienceonlinecards.s3.eu-central-1.amazonaws.com/cards/Cards-9-Spade.svg")'
				if (props.value === 10) return 'url("https://patienceonlinecards.s3.eu-central-1.amazonaws.com/cards/Cards-10-Spade.svg")'
				if (props.value === 11) return 'url("https://patienceonlinecards.s3.eu-central-1.amazonaws.com/cards/Cards-J-Spade.svg")'
				if (props.value === 12) return 'url("https://patienceonlinecards.s3.eu-central-1.amazonaws.com/cards/Cards-Q-Spade.svg")'
				if (props.value === 13) return 'url("https://patienceonlinecards.s3.eu-central-1.amazonaws.com/cards/Cards-K-Spade.svg")'
			}
			if (props.suit === "hearts") {
				if (props.value === 1) return 'url("https://patienceonlinecards.s3.eu-central-1.amazonaws.com/cards/Cards-A-Heart.svg")'
				if (props.value === 2) return 'url("https://patienceonlinecards.s3.eu-central-1.amazonaws.com/cards/Cards-2-Heart.svg")'
				if (props.value === 3) return 'url("https://patienceonlinecards.s3.eu-central-1.amazonaws.com/cards/Cards-3-Heart.svg")'
				if (props.value === 4) return 'url("https://patienceonlinecards.s3.eu-central-1.amazonaws.com/cards/Cards-4-Heart.svg")'
				if (props.value === 5) return 'url("https://patienceonlinecards.s3.eu-central-1.amazonaws.com/cards/Cards-5-Heart.svg")'
				if (props.value === 6) return 'url("https://patienceonlinecards.s3.eu-central-1.amazonaws.com/cards/Cards-6-Heart.svg")'
				if (props.value === 7) return 'url("https://patienceonlinecards.s3.eu-central-1.amazonaws.com/cards/Cards-7-Heart.svg")'
				if (props.value === 8) return 'url("https://patienceonlinecards.s3.eu-central-1.amazonaws.com/cards/Cards-8-Heart.svg")'
				if (props.value === 9) return 'url("https://patienceonlinecards.s3.eu-central-1.amazonaws.com/cards/Cards-9-Heart.svg")'
				if (props.value === 10) return 'url("https://patienceonlinecards.s3.eu-central-1.amazonaws.com/cards/Cards-10-Heart.svg")'
				if (props.value === 11) return 'url("https://patienceonlinecards.s3.eu-central-1.amazonaws.com/cards/Cards-J-Heart.svg")'
				if (props.value === 12) return 'url("https://patienceonlinecards.s3.eu-central-1.amazonaws.com/cards/Cards-Q-Heart.svg")'
				if (props.value === 13) return 'url("https://patienceonlinecards.s3.eu-central-1.amazonaws.com/cards/Cards-K-Heart.svg")'
			}
			if (props.suit === "diamonds") {
				if (props.value === 1) return 'url("https://patienceonlinecards.s3.eu-central-1.amazonaws.com/cards/Cards-A-Diamond.svg")'
				if (props.value === 2) return 'url("https://patienceonlinecards.s3.eu-central-1.amazonaws.com/cards/Cards-2-Diamond.svg")'
				if (props.value === 3) return 'url("https://patienceonlinecards.s3.eu-central-1.amazonaws.com/cards/Cards-3-Diamond.svg")'
				if (props.value === 4) return 'url("https://patienceonlinecards.s3.eu-central-1.amazonaws.com/cards/Cards-4-Diamond.svg")'
				if (props.value === 5) return 'url("https://patienceonlinecards.s3.eu-central-1.amazonaws.com/cards/Cards-5-Diamond.svg")'
				if (props.value === 6) return 'url("https://patienceonlinecards.s3.eu-central-1.amazonaws.com/cards/Cards-6-Diamond.svg")'
				if (props.value === 7) return 'url("https://patienceonlinecards.s3.eu-central-1.amazonaws.com/cards/Cards-7-Diamond.svg")'
				if (props.value === 8) return 'url("https://patienceonlinecards.s3.eu-central-1.amazonaws.com/cards/Cards-8-Diamond.svg")'
				if (props.value === 9) return 'url("https://patienceonlinecards.s3.eu-central-1.amazonaws.com/cards/Cards-9-Diamond.svg")'
				if (props.value === 10) return 'url("https://patienceonlinecards.s3.eu-central-1.amazonaws.com/cards/Cards-10-Diamond.svg")'
				if (props.value === 11) return 'url("https://patienceonlinecards.s3.eu-central-1.amazonaws.com/cards/Cards-J-Diamond.svg")'
				if (props.value === 12) return 'url("https://patienceonlinecards.s3.eu-central-1.amazonaws.com/cards/Cards-Q-Diamond.svg")'
				if (props.value === 13) return 'url("https://patienceonlinecards.s3.eu-central-1.amazonaws.com/cards/Cards-K-Diamond.svg")'
			}
			if (props.suit === "clubs") {
				if (props.value === 1) return 'url("https://patienceonlinecards.s3.eu-central-1.amazonaws.com/cards/Cards-A-Club.svg")'
				if (props.value === 2) return 'url("https://patienceonlinecards.s3.eu-central-1.amazonaws.com/cards/Cards-2-Club.svg")'
				if (props.value === 3) return 'url("https://patienceonlinecards.s3.eu-central-1.amazonaws.com/cards/Cards-3-Club.svg")'
				if (props.value === 4) return 'url("https://patienceonlinecards.s3.eu-central-1.amazonaws.com/cards/Cards-4-Club.svg")'
				if (props.value === 5) return 'url("https://patienceonlinecards.s3.eu-central-1.amazonaws.com/cards/Cards-5-Club.svg")'
				if (props.value === 6) return 'url("https://patienceonlinecards.s3.eu-central-1.amazonaws.com/cards/Cards-6-Club.svg")'
				if (props.value === 7) return 'url("https://patienceonlinecards.s3.eu-central-1.amazonaws.com/cards/Cards-7-Club.svg")'
				if (props.value === 8) return 'url("https://patienceonlinecards.s3.eu-central-1.amazonaws.com/cards/Cards-8-Club.svg")'
				if (props.value === 9) return 'url("https://patienceonlinecards.s3.eu-central-1.amazonaws.com/cards/Cards-9-Club.svg")'
				if (props.value === 10) return 'url("https://patienceonlinecards.s3.eu-central-1.amazonaws.com/cards/Cards-10-Club.svg")'
				if (props.value === 11) return 'url("https://patienceonlinecards.s3.eu-central-1.amazonaws.com/cards/Cards-J-Club.svg")'
				if (props.value === 12) return 'url("https://patienceonlinecards.s3.eu-central-1.amazonaws.com/cards/Cards-Q-Club.svg")'
				if (props.value === 13) return 'url("https://patienceonlinecards.s3.eu-central-1.amazonaws.com/cards/Cards-K-Club.svg")'
			}
		}
	}

	return (
		React.createElement("div", {
			id : props.PON,
			draggable: "true",
			data_stack: props.name,
			onDragStart: event => {
				if (props.dragstart_event(props)) {
					event.dataTransfer.setData('text', JSON.stringify(props))
					props.statechange_dragging(props, event)
				} else event.preventDefault()
			},
			onDragEnd: e => props.statechange_dragging(false, e),
			style: {
				cursor: props.dragstart_event(props) ? "grab": "default",
				borderRadius: '7px',
				padding: '.4vmax',
				marginRight: (props.player && props.name.includes('malus')) || (!props.player && props.name.includes('stock'))  ? !props.uppermost ? "max(-4vmax, -7vmin)" : 0 : !props.name.includes('tableau') && !props.name.includes("stock") && !props.name.includes("malus") ? !props.uppermost ? 'max(-2.9vmax, -5.5vmin)' : '0' : props.name.includes('tableau') && !props.player && !props.uppermost ? 'max(-2.9vmax, -5.5vmin)' : '0',
				marginLeft: (props.player && props.name.includes('stock') )|| (!props.player && props.name.includes('malus')) ? !props.uppermost ? "max(-4vmax, -7vmin)" : 0 : props.name.includes('tableau') && props.player ? !props.uppermost ? 'max(-2.9vmax, -5.5vmin)' : '0' : '0',
				height: 6 + "vmax",
				width: 4 + "vmax",
				maxHeight: '11vmin',
				maxWidth: '8.0vmin',
				zIndex: '1',
				background: "center / contain no-repeat " + card_images() + (props.color === "red" ? "#ffe7e6" : "#e9e8ff"),
				border: '1px  solid grey',
			}
		}, )
	)
}
 
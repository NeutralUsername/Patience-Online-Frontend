export function game_card(props) {
	function card_images() {
		if (!props.faceup)
			if (props.color === 'red') return 'url("https://patienceonlinecards.s3.eu-central-1.amazonaws.com/cards/Card_back_01.svg")'
		else return 'url("https://patienceonlinecards.s3.eu-central-1.amazonaws.com/cards/Card_back_06.svg")'
		else {
			if (props.suit === "spades") {
				if (props.value === 1) return 'url("https://patienceonlinecards.s3.eu-central-1.amazonaws.com/cards/AS.svg")'
				if (props.value === 2) return 'url("https://patienceonlinecards.s3.eu-central-1.amazonaws.com/cards/2S.svg")'
				if (props.value === 3) return 'url("https://patienceonlinecards.s3.eu-central-1.amazonaws.com/cards/3S.svg")'
				if (props.value === 4) return 'url("https://patienceonlinecards.s3.eu-central-1.amazonaws.com/cards/4S.svg")'
				if (props.value === 5) return 'url("https://patienceonlinecards.s3.eu-central-1.amazonaws.com/cards/5S.svg")'
				if (props.value === 6) return 'url("https://patienceonlinecards.s3.eu-central-1.amazonaws.com/cards/6S.svg")'
				if (props.value === 7) return 'url("https://patienceonlinecards.s3.eu-central-1.amazonaws.com/cards/7S.svg")'
				if (props.value === 8) return 'url("https://patienceonlinecards.s3.eu-central-1.amazonaws.com/cards/8S.svg")'
				if (props.value === 9) return 'url("https://patienceonlinecards.s3.eu-central-1.amazonaws.com/cards/9S.svg")'
				if (props.value === 10) return 'url("https://patienceonlinecards.s3.eu-central-1.amazonaws.com/cards/TS.svg")'
				if (props.value === 11) return 'url("https://patienceonlinecards.s3.eu-central-1.amazonaws.com/cards/JS.svg")'
				if (props.value === 12) return 'url("https://patienceonlinecards.s3.eu-central-1.amazonaws.com/cards/QS.svg")'
				if (props.value === 13) return 'url("https://patienceonlinecards.s3.eu-central-1.amazonaws.com/cards/KS.svg")'
			}
			if (props.suit === "hearts") {
				if (props.value === 1) return 'url("https://patienceonlinecards.s3.eu-central-1.amazonaws.com/cards/AH.svg")'
				if (props.value === 2) return 'url("https://patienceonlinecards.s3.eu-central-1.amazonaws.com/cards/2H.svg")'
				if (props.value === 3) return 'url("https://patienceonlinecards.s3.eu-central-1.amazonaws.com/cards/3H.svg")'
				if (props.value === 4) return 'url("https://patienceonlinecards.s3.eu-central-1.amazonaws.com/cards/4H.svg")'
				if (props.value === 5) return 'url("https://patienceonlinecards.s3.eu-central-1.amazonaws.com/cards/5H.svg")'
				if (props.value === 6) return 'url("https://patienceonlinecards.s3.eu-central-1.amazonaws.com/cards/6H.svg")'
				if (props.value === 7) return 'url("https://patienceonlinecards.s3.eu-central-1.amazonaws.com/cards/7H.svg")'
				if (props.value === 8) return 'url("https://patienceonlinecards.s3.eu-central-1.amazonaws.com/cards/8H.svg")'
				if (props.value === 9) return 'url("https://patienceonlinecards.s3.eu-central-1.amazonaws.com/cards/9H.svg")'
				if (props.value === 10) return 'url("https://patienceonlinecards.s3.eu-central-1.amazonaws.com/cards/TH.svg")'
				if (props.value === 11) return 'url("https://patienceonlinecards.s3.eu-central-1.amazonaws.com/cards/JH.svg")'
				if (props.value === 12) return 'url("https://patienceonlinecards.s3.eu-central-1.amazonaws.com/cards/QH.svg")'
				if (props.value === 13) return 'url("https://patienceonlinecards.s3.eu-central-1.amazonaws.com/cards/KH.svg")'
			}
			if (props.suit === "diamonds") {
				if (props.value === 1) return 'url("https://patienceonlinecards.s3.eu-central-1.amazonaws.com/cards/AD.svg")'
				if (props.value === 2) return 'url("https://patienceonlinecards.s3.eu-central-1.amazonaws.com/cards/2D.svg")'
				if (props.value === 3) return 'url("https://patienceonlinecards.s3.eu-central-1.amazonaws.com/cards/3D.svg")'
				if (props.value === 4) return 'url("https://patienceonlinecards.s3.eu-central-1.amazonaws.com/cards/4D.svg")'
				if (props.value === 5) return 'url("https://patienceonlinecards.s3.eu-central-1.amazonaws.com/cards/5D.svg")'
				if (props.value === 6) return 'url("https://patienceonlinecards.s3.eu-central-1.amazonaws.com/cards/6D.svg")'
				if (props.value === 7) return 'url("https://patienceonlinecards.s3.eu-central-1.amazonaws.com/cards/7D.svg")'
				if (props.value === 8) return 'url("https://patienceonlinecards.s3.eu-central-1.amazonaws.com/cards/8D.svg")'
				if (props.value === 9) return 'url("https://patienceonlinecards.s3.eu-central-1.amazonaws.com/cards/9D.svg")'
				if (props.value === 10) return 'url("https://patienceonlinecards.s3.eu-central-1.amazonaws.com/cards/TD.svg")'
				if (props.value === 11) return 'url("https://patienceonlinecards.s3.eu-central-1.amazonaws.com/cards/JD.svg")'
				if (props.value === 12) return 'url("https://patienceonlinecards.s3.eu-central-1.amazonaws.com/cards/QD.svg")'
				if (props.value === 13) return 'url("https://patienceonlinecards.s3.eu-central-1.amazonaws.com/cards/KD.svg")'
			}
			if (props.suit === "clubs") {
				if (props.value === 1) return 'url("https://patienceonlinecards.s3.eu-central-1.amazonaws.com/cards/AC.svg")'
				if (props.value === 2) return 'url("https://patienceonlinecards.s3.eu-central-1.amazonaws.com/cards/2C.svg")'
				if (props.value === 3) return 'url("https://patienceonlinecards.s3.eu-central-1.amazonaws.com/cards/3C.svg")'
				if (props.value === 4) return 'url("https://patienceonlinecards.s3.eu-central-1.amazonaws.com/cards/4C.svg")'
				if (props.value === 5) return 'url("https://patienceonlinecards.s3.eu-central-1.amazonaws.com/cards/5C.svg")'
				if (props.value === 6) return 'url("https://patienceonlinecards.s3.eu-central-1.amazonaws.com/cards/6C.svg")'
				if (props.value === 7) return 'url("https://patienceonlinecards.s3.eu-central-1.amazonaws.com/cards/7C.svg")'
				if (props.value === 8) return 'url("https://patienceonlinecards.s3.eu-central-1.amazonaws.com/cards/8C.svg")'
				if (props.value === 9) return 'url("https://patienceonlinecards.s3.eu-central-1.amazonaws.com/cards/9C.svg")'
				if (props.value === 10) return 'url("https://patienceonlinecards.s3.eu-central-1.amazonaws.com/cards/TC.svg")'
				if (props.value === 11) return 'url("https://patienceonlinecards.s3.eu-central-1.amazonaws.com/cards/JC.svg")'
				if (props.value === 12) return 'url("https://patienceonlinecards.s3.eu-central-1.amazonaws.com/cards/QC.svg")'
				if (props.value === 13) return 'url("https://patienceonlinecards.s3.eu-central-1.amazonaws.com/cards/KC.svg")'
			}
		}
	}

	return (
		React.createElement("div", {
			id: props.PON,
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
				cursor: props.dragstart_event(props) ? "grab" : "default",
				borderRadius: '7px',
				padding: '.4vmax',
				marginRight: (props.player && props.name.includes('malus')) || (!props.player && props.name.includes('stock')) ? !props.uppermost ? "max(-4vmax, -7vmin)" : 0 : !props.name.includes('tableau') && !props.name.includes("stock") && !props.name.includes("malus") ? !props.uppermost ? 'max(-2.9vmax, -5.5vmin)' : '0' : props.name.includes('tableau') && !props.player && !props.uppermost ? 'max(-2.9vmax, -5.5vmin)' : '0',
				marginLeft: (props.player && props.name.includes('stock')) || (!props.player && props.name.includes('malus')) ? !props.uppermost ? "max(-4vmax, -7vmin)" : 0 : props.name.includes('tableau') && props.player ? !props.uppermost ? 'max(-2.9vmax, -5.5vmin)' : '0' : '0',
				height: 6 + "vmax",
				width: 4 + "vmax",
				maxHeight: '11vmin',
				maxWidth: '8.0vmin',
				zIndex: '1',
				background: "center / contain no-repeat " + card_images() +  "white",
				border: '1px  solid grey',
			}
		}, )
	)
}
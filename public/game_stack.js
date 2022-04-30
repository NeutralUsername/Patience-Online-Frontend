
import {
	game_card
} from "./game_card.js"
import {
	PON_from_card
} from "./PON.js"

export function game_stack(props) {
	function topValues() {
		if (!props.player) {
			if (props.name.includes('malus')) return '1vmin'
			if (props.name.includes('stock')) return '1vmin'
			if (props.name.includes('discard')) return '1vmin'
			if (props.name.includes('reserve')) return '1vmin'
			if (props.name.includes('tableau0') || props.name.includes('foundation0')) return '66vmin'
			if (props.name.includes('tableau1') || props.name.includes('foundation1')) return '50vmin'
			if (props.name.includes('tableau2') || props.name.includes('foundation2')) return '34vmin'
			if (props.name.includes('tableau3') || props.name.includes('foundation3')) return '18vmin'
		}
		if (props.player) {
			if (props.name.includes('malus')) return '83.0vmin'
			if (props.name.includes('stock')) return '83.0vmin'
			if (props.name.includes('discard')) return '83.0vmin'
			if (props.name.includes('reserve')) return '83.0vmin'
			if (props.name.includes('tableau0') || props.name.includes('foundation0')) return '18vmin'
			if (props.name.includes('tableau1') || props.name.includes('foundation1')) return '34vmin'
			if (props.name.includes('tableau2') || props.name.includes('foundation2')) return '50vmin'
			if (props.name.includes('tableau3') || props.name.includes('foundation3')) return '66vmin'
		}
	}

	function leftValue() {
		if(props.player) {
			if (props.name.includes('stock')){
				return '63.8vmax'
			}
			if (props.name.includes('discard')) {
				return '55.3vmax'
			}
			if (props.name.includes('reserve')) {
				return '39.9vmax'
			}
			if (props.name.includes('malus')) {
				var stock_leftdistance = document.getElementById(props.name.includes("red") ? "redstock" : "blackstock" ) ? document.getElementById(props.name.includes("red") ? "redstock" : "blackstock" ).offsetLeft: 0
				var discard_leftdistance = document.getElementById(props.name.includes("red") ? "reddiscard" : "blackdiscard") ?  document.getElementById(props.name.includes("red") ? "reddiscard" : "blackdiscard").offsetLeft: 0
				var reserve_leftdistance = document.getElementById(props.name.includes("red") ? "redreserve" : "blackreserve" ) ? document.getElementById(props.name.includes("red") ? "redreserve" : "blackreserve" ).offsetLeft: 0
				var discard_width = document.getElementById(props.name.includes("red") ? "reddiscard" : "blackdiscard") ?  document.getElementById(props.name.includes("red") ? "reddiscard" : "blackdiscard").clientWidth: 0
				var stock_discard_distance = stock_leftdistance - (discard_leftdistance+discard_width)
				var width = document.getElementById(props.name) ?  document.getElementById(props.name).clientWidth : 0
				var old_val = document.getElementById(props.name)? document.getElementById(props.name).style.left : ""
				if(old_val)
				old_val = old_val.slice(0, old_val.length-2)
				var new_val = reserve_leftdistance-width-stock_discard_distance
				return old_val ? (parseInt(old_val) === new_val+1 || parseInt(old_val) === new_val-1 ) ?  parseInt(old_val) : new_val : new_val
			}
		}
		else {
			if (props.name.includes('stock')){
				var malus_leftdistance = document.getElementById(props.name.includes("red") ? "redmalus" : "blackmalus" ) ? document.getElementById(props.name.includes("red") ? "redmalus" : "blackmalus" ).offsetLeft: 0
				var reserve_leftdistance = document.getElementById(props.name.includes("red") ? "redreserve" : "blackreserve") ?  document.getElementById(props.name.includes("red") ? "redreserve" : "blackreserve").offsetLeft: 0
				var discard_leftdistance = document.getElementById(props.name.includes("red") ? "reddiscard" : "blackdiscard" ) ? document.getElementById(props.name.includes("red") ? "reddiscard" : "blackdiscard" ).offsetLeft: 0
				var reserve_width = document.getElementById(props.name.includes("red") ? "redreserve" : "blackreserve") ?  document.getElementById(props.name.includes("red") ? "redreserve" : "blackreserve").clientWidth: 0
				var malus_reserve_distance = malus_leftdistance - (reserve_leftdistance+reserve_width)
				var width = document.getElementById(props.name) ?  document.getElementById(props.name).clientWidth : 0
				var old_val = document.getElementById(props.name)? document.getElementById(props.name).style.left : ""
				if(old_val)
				old_val = old_val.slice(0, old_val.length-2)
				var new_val = discard_leftdistance-width-malus_reserve_distance
				return old_val ? (parseInt(old_val) === new_val+1 || parseInt(old_val) === new_val-1 ) ?  parseInt(old_val) : new_val : new_val
			}
			if (props.name.includes('discard')) {
				return '39.9vmax'
			}
			if (props.name.includes('reserve')) {
					return '55.3vmax'
			}
			if (props.name.includes('malus')) {
				return '63.8vmax'

			}
		}
	

		if (props.player && props.name.includes("tableau")) {
			var opponenttableau_leftdistance = document.getElementById(props.name.includes("red") ? "blacktableau0" : "redtableau0" ) ? document.getElementById(props.name.includes("red") ? "blacktableau0" : "redtableau0" ).offsetLeft: 0
			var opponentfoundation_leftdistance = document.getElementById(props.name.includes("red") ? "blackfoundation0" : "redfoundation0") ?  document.getElementById(props.name.includes("red") ? "blackfoundation0" : "redfoundation0" ).offsetLeft: 0
			var playerfoundation_leftdistance = document.getElementById(props.name.includes("red") ? "redfoundation0" : "blackfoundation0" ) ? document.getElementById(props.name.includes("red") ? "redfoundation0" : "blackfoundation0" ).offsetLeft: 0
			var opponentfoundation_width = document.getElementById(props.name.includes("red") ? "blackfoundation0" : "redfoundation0") ?  document.getElementById(props.name.includes("red") ? "blackfoundation0" : "redfoundation0").clientWidth: 0
			var opponent_tableaufoundation_distance = opponenttableau_leftdistance - (opponentfoundation_leftdistance+opponentfoundation_width)
			var width = document.getElementById(props.name) ?  document.getElementById(props.name).clientWidth : 0
			var old_val = document.getElementById(props.name)? document.getElementById(props.name).style.left : ""
			if(old_val)
			old_val = old_val.slice(0, old_val.length-2)
			var new_val = playerfoundation_leftdistance-width-opponent_tableaufoundation_distance
			return old_val ? (parseInt(old_val) === new_val+1 || parseInt(old_val) === new_val-1 ) ?  parseInt(old_val) : new_val : new_val
		}
		if (props.player) {
			if (props.name.includes('foundation0')) return '42.9vmax'
			if (props.name.includes('foundation1')) return '42.9vmax'
			if (props.name.includes('foundation2')) return '42.9vmax'
			if (props.name.includes('foundation3')) return '42.9vmax'
		}
		if (!props.player) {
			if (props.name.includes('tableau0')) return '61.3vmax'
			if (props.name.includes('tableau1')) return '61.3vmax'
			if (props.name.includes('tableau2')) return '61.3vmax'
			if (props.name.includes('tableau3')) return '61.3vmax'
			if (props.name.includes('foundation0')) return '53.1vmax'
			if (props.name.includes('foundation1')) return '53.1vmax'
			if (props.name.includes('foundation2')) return '53.1vmax'
			if (props.name.includes('foundation3')) return '53.1vmax'
		}
	}
	var card_elements = []
	if (props.cards)
		if( ! ( props.name.includes("discard") || props.name.includes("foundation")))
			props.cards.map((card, index) => {
				card_elements.push(React.createElement(game_card, {
					key: index,
					PON : PON_from_card(card),
					color: card.color,
					faceup: card.faceup,
					suit: card.suit,
					value: card.value,
					name: props.name,
					player: props.player,
					faceup: card.faceup,
					uppermost: index === props.cards.length - 1,
					dragstart_event: props.dragstart_event,
					statechange_dragging: props.statechange_dragging,
					leftclick_event : props.leftclick_event
				}, ))
			})
		else {
			var uppermost_card = props.cards.length > 0 ? props.cards[props.cards.length-1] : false
			if(uppermost_card)
				card_elements.push(React.createElement(game_card, {
					key: 0,
					PON : PON_from_card(uppermost_card),
					color: uppermost_card.color,
					faceup: uppermost_card.faceup,
					suit: uppermost_card.suit,
					value: uppermost_card.value,
					name: props.name,
					player: props.player,
					faceup: uppermost_card.faceup,
					uppermost: true,
					dragstart_event: props.dragstart_event,
					statechange_dragging: props.statechange_dragging,
					leftclick_event : props.leftclick_event
				}, ))
		}

	return (
		React.createElement("div", {
			id : props.name,
			onDragOver: (e) => {
				e.preventDefault()
			},
			onDragLeave: event => {
				props.drag_event(event)
			},
			onClick : e => {
					props.leftclick_event(props.cards[props.cards.length-1], props.name)
			},
			onContextMenu : e=> {
				props.rightclick_event(props.cards[props.cards.length-1], props.name)
			},
			onDrop: (event) => {
				event.preventDefault()
				props.drop_event( JSON.parse(event.dataTransfer.getData("text")) ,event.target.attributes.data_stack.value ) 
			},
			onDragEnter: (e) => {
				e.preventDefault()
				props.drag_event(e)
			},
			data_stack: props.name,
			style: {
				border: (props.name.includes("reserve") ? "3px" : props.name.includes("stock") ? '3px' : '1px') + ' solid #636363',
				borderRadius: (props.name.includes("reserve") ? "7px" : '2px'),
				position: 'absolute',
				left: leftValue(),
				top: topValues(),
				display: 'flex',
				alignItems: 'center',
				flexDirection: props.player && props.name.includes("stock")? "row-reverse" :  !props.player && props.name.includes("malus")? "row-reverse" : props.player && props.name.includes("tableau") ? 'row-reverse' : '',
		
				paddingLeft: '.5vmax',
				paddingRight: '.5vmax' ,
				minWidth: "4.7vmax",
				height: '7.6vmax',
				maxHeight: '15vmin',
				backgroundColor: props.color
			}
		}, "", card_elements)
	)
}

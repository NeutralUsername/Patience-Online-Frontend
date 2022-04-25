import {
	socket
} from "./index.js"


export class community_spectate extends React.Component {
	constructor(props) {
		super(props)
		this.state = JSON.parse(JSON.stringify(this.props))
	}

	render() {
		return React.createElement('div', {
				className: "community_spectate",
			},
			React.createElement("article", {}, React.createElement("b", {}, 'spectate ranked games')),
			React.createElement("div", {
				style: {
					fontSize: "10%"
				}
			}, "\u00A0"),

			React.createElement(active_rooms, {
				active_rooms: this.props.active_rooms,
			}),
		)
	}
}

function active_rooms(props) {
	function spectate_click(blackid, redid) {
		socket.emit("spectate_game", {
			initial_red_socketid: redid,
			initial_black_socketid: blackid
		})
	}
	return (
		React.createElement('ul', {
			className: "active_rooms"
		}, props.active_rooms.map((room, index) => {
			return React.createElement("li", {
					key: index,
				}, React.createElement('u', {}, room.red_username + " vs. " + room.black_username), //missing roomname click for roomdetails
				room.secret ? " 🔒" : " ", React.createElement('button', {
					onClick: () => spectate_click(room.initial_black_socketid, room.initial_red_socketid),
					style: {
						cursor: "pointer"
					}
				}, "spectate"), React.createElement("div", {
					style: {
						fontSize: "10%"
					}
				}, "\u00A0"), )
		}))
	)
}
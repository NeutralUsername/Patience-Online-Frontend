import {
	socket
} from "./index.js"

export class game_chat extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			input_field : "",
		}
		setTimeout ( () => {
			const element = document.getElementById("chat");
			element.scrollTop = element.scrollHeight;
		},100)
	}
	render() {
		var index = 0
		var components = []
		for(var msg of this.props.messages) {
			components.push(
					React.createElement("li", {key : index++, style : {borderBottom : "1px solid black", position : "relative", left : "-2.2vmin"}}, React.createElement("b", {}, msg.sender+": ") , msg.text)
			)
		}
		return React.createElement("form", {
			id : "chat_form",
			onSubmit : e=>{ 
				e.preventDefault()
				if(this.state.input_field.length) {
					this.props.messages.push({sender : this.props.player_username, text : this.state.input_field})
					this.props.statechange_messages(this.props.messages)
					socket.emit("game_chat_message", this.state.input_field)
					this.setState({input_field : ""})
					setTimeout ( () => {
						const element = document.getElementById("chat");
						element.scrollTop = element.scrollHeight;
					},10)
				}
			},
		},
			React.createElement("ul", {
				id : "chat",
				style : {
					listStyleType: "none",
					border : "solid #424242",
					borderRadius : "5px",
					position: "absolute",
					top: "8vmin",
					left : "1vmin",
					backgroundColor :"white",
					zIndex : "10",
					height : "65vmin",
					width : "60vmin",
					opacity : "0.7",
					overflowY : "scroll",
				},
			}, 	
			components
			),
			React.createElement ("div", {
				style : {
					opacity : "0.7",
					zIndex : "11",
					position: "absolute",
					top: "76vmin",
					left : "1vmin",
					display: "flex",
					height : "3vmin",
				}
			}, 
				React.createElement("input", { 
					type : "submit",
					style : {
						border : "2px solid #424242",
						height : "3.65vmin",
						fontSize : "2vmin",
					},
					value : "send",
				}),	
				React.createElement("input", { 
					type : "text",
					value : this.state.input_field,
					onChange : e => {
						this.setState({input_field : e.target.value})
					},
					style : {
						border : "2px solid #424242",
						width : "45vmin",
						height : "3vmin",
						fontSize : "2vmin",
					}
				}),
			),
		)
	}
}
import parse from "./parse.js"

interface Party {
	friends: WebSocket[]
	tempo: number
	Q: number
}

function tell(friend: WebSocket, party: Party) {
	console.log(`tempo ${party.tempo} Q ${party.Q}`)
	friend.send(`tempo ${party.tempo} Q ${party.Q}`)
}

Deno.serve({port: 51234}, request => {
	let parties: {
		[key: string]: Party
	} = {}
	if (request.headers.get("upgrade") != "websocket") {
		return new Response(null, {status: 501})
	}
	let path = new URL(request.url).pathname
	console.info(parties[path])
	parties[path] ??= {friends: [], tempo: 0, Q: 0}
	console.info(parties[path])
	let {socket, response} = Deno.upgradeWebSocket(request)
	socket.addEventListener("open", function (_event) {
		let person = this
		let party = parties[path]
		party.friends.push(person)
		tell(person, party)
	})
	socket.addEventListener("close", function (_event) {
		let person = this
		let party = parties[path]
		party.friends = parties[path].friends.filter(friend => person == friend)
	})
	socket.addEventListener("message", function (event) {
		let person = this
		let party = parties[path]
		let message = parse(event.data)
		let diff = false
		if (message.tempo) {
			party.tempo = message.tempo
			diff = true
		}
		if (message.Q) {
			party.Q = message.Q
			diff = true
		}
		if (diff)
			party.friends.forEach(friend => {
				if (person != friend) tell(friend, party)
			})
	})
	return response
})

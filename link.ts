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

let parties: {
	[key: string]: Party
} = {}

Deno.serve({port: 51234}, request => {
	if (request.headers.get("upgrade") != "websocket") {
		return new Response(null, {status: 501})
	}
	let path = new URL(request.url).pathname
	parties[path] ??= {friends: [], tempo: 0, Q: 0}
	let {socket, response} = Deno.upgradeWebSocket(request)
	socket.addEventListener("open", function (_event) {
		try {
			let person = this
			let party = parties[path]
			party.friends.push(person)
			tell(person, party)
		} catch {}
	})
	socket.addEventListener("close", function (_event) {
		try {
			let person = this
			let party = parties[path]
			party.friends = parties[path].friends.filter(
				friend => person == friend
			)
		} catch {}
	})
	socket.addEventListener("message", function (event) {
		try {
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
					if (friend != person && friend.readyState == friend.OPEN)
						tell(friend, party)
				})
		} catch {}
	})
	return response
})

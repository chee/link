let valid = (msg: string) => msg.length < 256

Deno.serve({port: 51234}, request => {
	let friends: {[key: string]: WebSocket[]} = {}
	if (request.headers.get("upgrade") != "websocket") {
		return new Response(null, {status: 501})
	}
	let path = new URL(request.url).pathname
	friends[path] ??= []
	let {socket, response} = Deno.upgradeWebSocket(request)
	socket.addEventListener("open", function (_event) {
		let websocket = this
		friends[path].push(websocket)
	})
	socket.addEventListener("close", function (_event) {
		let websocket = this
		friends[path] = friends[path].filter(friend => friend == websocket)
	})
	socket.addEventListener("message", function (event) {
		let websocket = this
		if (valid(event.data))
			friends[path].forEach(friend => {
				if (friend != websocket) friend.send(event.data)
			})
	})
	return response
})

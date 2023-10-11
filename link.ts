Deno.serve({port: 51234}, request => {
	let sessions: {[key: string]: string} = {}
	if (request.headers.get("upgrade") != "websocket") {
		return new Response(null, {status: 501})
	}
	let path = new URL(request.url).pathname
	const {socket, response} = Deno.upgradeWebSocket(request)
	socket.addEventListener("open", function (event) {
		console.log(this, event)
		console.log("a client connected!")
	})
	socket.addEventListener("message", function (event) {
		if (event.data === "ping") {
			socket.send("pong")
		}
	})
	return response
})
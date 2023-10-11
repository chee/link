import parse from "parse.js"
/** @type {HTMLFormElement} */
let form = document.querySelector("form#channel")
/** @type {HTMLInputElement} */
let channel = document.querySelector("form#channel input")
/** @type {HTMLFormElement} */
let tempoForm = document.querySelector("form#tempo")
/** @type {HTMLInputElement} */
let tempo = document.querySelector("form#tempo input")

form.addEventListener("submit", event => {
	let sock = new WebSocket(`wss://link.chee.party/${channel?.value}`)
	sock.addEventListener("message", event => {
		try {
			let opts = parse(event.data)
			tempo.value = opts.tempo
		} catch (error) {
			console.error(error)
		}
	})
	tempoForm.onsubmit = function (event) {
		event.preventDefault()
		sock.send(`tempo ${tempo.value}`)
	}
})

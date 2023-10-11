/** @type {HTMLFormElement} */
let form = document.querySelector("form#channel")
/** @type {HTMLInputElement} */
let channel = document.querySelector("form#channel input")
/** @type {HTMLFormElement} */
let tempoForm = document.querySelector("form#tempo")
/** @type {HTMLInputElement} */
let tempo = document.querySelector("form#tempo input")

let mungemap = {
	tempo: Number,
	Q: Number,
}

/**
 * @typedef {Object} Message
 * @property {number?} Message.tempo
 * @property {number?} Message.Q
 */
/**
 * @param {string} message
 * @returns {Message}
 */
function parse(message) {
	let terms = message.split(/\s+/)
	let data = {}

	for (let i = 0; i < terms.length; i += 2) {
		let key = terms[i]
		let value = terms[i + 1]
		value = mungemap[key] ? mungemap[key](value) : value
		data[key] = value
	}
	return data
}

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

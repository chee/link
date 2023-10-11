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
export default function parse(message) {
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

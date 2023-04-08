const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const sessionSchema = new Schema({
	sender: {
		type: String,
		required: true,
		ref: 'User',
	},
	message: {
		type: String,
		required: true,
	},
	receiver: {
		type: String,
		ref: 'User',
	},
	createdAt: {
		type: Date,
		immutable: true,
		default: () => Date.now(),
	},
});

module.exports = mongoose.model('Session', sessionSchema);

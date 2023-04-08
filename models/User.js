const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
	email: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	fullName: {
		type: String,
		required: true,
	},
	phoneNumber: {
		type: String,
		required: true,
	},
	role: {
		type: String,
		enum: ['Customer', 'Consultant', 'Admin'],
		default: 'Customer',
	},
	cart: {
		items: [
			{
				productId: {
					type: String,
					ref: 'Product',
					required: true,
				},
				quantity: { type: Number, required: true },
			},
		],
	},
});

module.exports = mongoose.model('User', userSchema);

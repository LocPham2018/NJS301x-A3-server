const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orderSchema = new Schema({
	products: [
		{
			productId: { type: String, required: true, ref: 'Product' },
			quantity: { type: Number, required: true },
		},
	],
	user: {
		type: String,
		required: true,
		ref: 'User',
	},
	address: String,
	total: Number,
	createdAt: {
		type: Date,
		immutable: true,
		default: () => Date.now(),
	},
});

module.exports = mongoose.model('Order', orderSchema);

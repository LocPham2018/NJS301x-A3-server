const express = require('express');
const { body } = require('express-validator');

const route = express.Router();

const clientController = require('../controllers/client');

// route.get('/cart/:userId', clientController.getCart);
// route.post('/cart/:userId', clientController.updateCart);

route.get('/orders/bill/:id', clientController.getOrdersById);
route.get('/orders/:userId', clientController.getOrdersByUserId);

route.post(
	'/checkout',
	[
		body('email', 'Invalid email.').isEmail(),
		body('fullName', 'Name must not be empty.')
			.isLength({ min: 1 })
			.isAlphanumeric('en-US', {ignore: ' -'})
			.trim(),
		body('phoneNumber', 'Phone number must not be empty.')
			.isLength({ min: 1 })
			.isAlphanumeric()
			.trim(),
		body('address', 'Address number must not be empty.')
			.isLength({ min: 1 })
			.isAlphanumeric('en-US', {ignore: ' -,'})
			.trim(),
	],
	clientController.checkout
);

module.exports = route;

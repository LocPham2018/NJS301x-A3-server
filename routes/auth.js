const express = require('express');
const { body } = require('express-validator');

const route = express.Router();

const authController = require('../controllers/auth');

route.post(
	'/login',
	[
		body('email', 'Invalid email.').isEmail(),
		body('password', 'Password must be more than 8 characters.')
			.isLength({ min: 9 })
			.isAlphanumeric()
			.trim(),
	],
	authController.login
);

route.post(
	'/signup',
	[
		body('email', 'Invalid email.').isEmail(),
		body('password', 'Password must be more than 8 characters.')
			.isLength({ min: 9 })
			.isAlphanumeric()
			.trim(),
		body('fullName', 'Name must not be empty.')
			.isLength({ min: 1 })
			.isAlphanumeric('en-US', {ignore: ' -'})
			.trim(),
		body('phoneNumber', 'Phone number must not be empty.')
			.isLength({ min: 1 })
			.isAlphanumeric()
			.trim(),
	],
	authController.signup
);

route.get('/session', authController.getLoginStatus);

route.post('/logout', authController.logout);

module.exports = route;

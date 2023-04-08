const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Product = require('../models/Product');

exports.login = async (req, res, next) => {
	const { email, password } = req.body;
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ err: errors.errors[0].msg });
	}

	const { admin } = req.query;
	try {
		const user = await User.findOne({ email });
		if (!user) {
			return res
				.status(401)
				.json({ message: 'Invalid email or password.' });
		}

		const doMatch = await bcrypt.compare(password, user.password);
		if (doMatch && admin && user.role === 'Customer') {
			return res.status(403).json({ message: 'Permission denied.' });
		}
		if (doMatch && admin) {
			req.session.user = user;
			return res.json({
				success: true,
				message: 'Login successful.',
			});
		}
		if (doMatch) {
			req.session.user = user;
			// const items = await Promise.all(
			// 	user.cart.items.map(async item => {
			// 		const product = await Product.findById(item.productId);
			// 		return { product, qty: item.quantity };
			// 	})
			// );
			return res.json({
				success: true,
				message: 'Login successful.',
			});
		}
		res.status(401).json({ message: 'Invalid email or password.' });
	} catch (err) {
		res.status(500).json({ message: 'Error', err });
	}
};

exports.signup = async (req, res, next) => {
	const { email, password, fullName, phoneNumber } = req.body;
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ err: errors.errors[0].msg });
	}

	try {
		const foundUser = await User.findOne({ email });
		if (foundUser) {
			return res.status(400).json({ message: 'This email has existed.' });
		}

		const hashPassword = await bcrypt.hash(password, 16);
		const user = new User({
			email,
			password: hashPassword,
			fullName,
			phoneNumber,
			cart: { items: [] },
		});
		await user.save();
		res.json({ success: true, message: 'Signup successful.', user });
	} catch (err) {
		res.status(500).json({ message: 'Error', err });
	}
};

exports.logout = (req, res, next) => {
	req.session.destroy(err => {
		console.log(err);
		res.json({ err });
	});
	// res.json({ success: true });
};

exports.getLoginStatus = (req, res, next) => {
	res.json({ user: req.session.user });
};

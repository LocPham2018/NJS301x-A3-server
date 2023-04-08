const { validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
const { OAuth2Client } = require('google-auth-library');

const GOOGLE_MAILER_CLIENT_ID = process.env.GOOGLE_MAILER_CLIENT_ID;
const GOOGLE_MAILER_CLIENT_SECRET = process.env.GOOGLE_MAILER_CLIENT_SECRET;
const GOOGLE_MAILER_REFRESH_TOKEN = process.env.GOOGLE_MAILER_REFRESH_TOKEN;
const ADMIN_EMAIL_ADDRESS = process.env.ADMIN_EMAIL_ADDRESS;

const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const setEmailContent = require('../utils/email-content');

const myOAuth2Client = new OAuth2Client(
	GOOGLE_MAILER_CLIENT_ID,
	GOOGLE_MAILER_CLIENT_SECRET
);

myOAuth2Client.setCredentials({
	refresh_token: GOOGLE_MAILER_REFRESH_TOKEN,
});

exports.checkout = async (req, res, next) => {
	const { userId, email, fullName, phoneNumber, cart, address } = req.body;
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ err: errors.errors[0].msg });
	}

	try {
		// save order
		const items = cart.items.map(item => {
			return {
				productId: item.product._id,
				quantity: item.qty,
			};
		});
		const total = cart.total;
		const order = new Order({
			products: items,
			user: userId,
			total,
			address,
		});
		await order.save();

		// create transporter to send email
		const tokenObj = await myOAuth2Client.getAccessToken();
		const token = tokenObj?.token;
		const transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				type: 'OAuth2',
				user: ADMIN_EMAIL_ADDRESS,
				clientId: GOOGLE_MAILER_CLIENT_ID,
				clientSecret: GOOGLE_MAILER_CLIENT_SECRET,
				refresh_token: GOOGLE_MAILER_REFRESH_TOKEN,
				accessToken: token,
			},
		});
		await transporter.sendMail({
			to: email,
			subject: 'Order complete!',
			html: setEmailContent(fullName, phoneNumber, address, cart),
		});

		// response to client
		res.json({
			success: true,
			message: 'Order successful. Check your email for details.',
		});
	} catch (err) {
		res.status(500).json({ message: 'Error', err });
	}
};

exports.getOrdersByUserId = async (req, res, next) => {
	const { userId } = req.params;
	try {
		const orders = await Order.find({ user: userId });
		await User.findByIdAndUpdate(userId, { cart: { items: [] } });
		res.json({ success: true, orders });
	} catch (err) {
		res.status(500).json({ message: 'Error', err });
	}
};

exports.getOrdersById = async (req, res, next) => {
	const { id } = req.params;
	try {
		const order = await Order.findById(id).populate('user');
		const {
			user: { _id: userId, fullName, phoneNumber },
			address,
			products,
			total,
		} = order;
		const productList = await Promise.all(
			products.map(async product => {
				const productDetail = await Product.findById(product.productId);
				return { product: productDetail, qty: product.quantity };
			})
		);
		res.json({
			success: true,
			order: {
				userId,
				fullName,
				phoneNumber,
				address,
				total,
				products: productList,
			},
		});
	} catch (err) {
		res.status(500).json({ message: 'Error', err });
	}
};

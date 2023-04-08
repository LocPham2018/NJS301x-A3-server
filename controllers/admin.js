const Order = require('../models/Order');

exports.getOrders = async (req, res, next) => {
	try {
		const orders = await Order.find().populate('user');
		res.json({ success: true, orders });
	} catch (err) {
		res.status(500).json({ message: 'Error', err });
	}
};

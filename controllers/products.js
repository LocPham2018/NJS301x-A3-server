const { ObjectId } = require('mongodb');
const Product = require('../models/Product');

exports.getAllProducts = async (req, res, next) => {
	try {
		const results = await Product.find();
		res.json({ success: true, results });
	} catch (err) {
		res.status(500).json({ message: 'Error', err });
	}
};

exports.getProductsByPage = async (req, res, next) => {
	const { page } = req.params;
	const perPage = 5;
	try {
		const countPromise = Product.countDocuments();
		const resultsPromise = Product.find()
			.skip((page - 1) * perPage)
			.limit(perPage);
		const [count, results] = await Promise.all([
			countPromise,
			resultsPromise,
		]);
		const totalPages = Math.ceil(count / perPage);
		res.json({ success: true, results, page: +page, totalPages });
	} catch (err) {
		res.status(500).json({ message: 'Error', err });
	}
};

exports.getProduct = async (req, res, next) => {
	const { id } = req.params;
	const { getRelated } = req.query;
	try {
		const product = await Product.findById(id);
		if (getRelated) {
			const related = await Product.find({
				category: product.category,
				_id: { $ne: product._id },
			});
			return res.json({ success: true, product, related });
		}
		res.json({ success: true, product });
	} catch (err) {
		res.status(500).json({ message: 'Error', err });
	}
};

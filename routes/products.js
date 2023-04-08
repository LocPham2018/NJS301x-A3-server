const express = require('express');

const route = express.Router();

const productController = require('../controllers/products');

route.get('/all', productController.getAllProducts);
route.get('/page/:page', productController.getProductsByPage);
route.get('/:id', productController.getProduct);

module.exports = route;

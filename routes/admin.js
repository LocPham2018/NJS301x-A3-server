const express = require('express');

const route = express.Router();

const adminController = require('../controllers/admin');

route.get('/orders', adminController.getOrders);

module.exports = route;

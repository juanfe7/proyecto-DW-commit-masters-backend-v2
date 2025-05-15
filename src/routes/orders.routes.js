const express = require('express');
const router = express.Router();
const { createOrder, getOrderStatus, getOrders } = require('../controllers/orders.controller');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, createOrder);
router.get('/:id/status', authMiddleware, getOrderStatus);
router.get('/', authMiddleware, getOrders);

module.exports = router;

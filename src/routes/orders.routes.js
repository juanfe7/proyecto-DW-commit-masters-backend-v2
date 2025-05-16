const express = require('express');
const router = express.Router();
const { createOrder, getOrderStatus, getOrders, getOrderHistory } = require('../controllers/orders.controller');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, createOrder);
router.get('/:id/status', authMiddleware, getOrderStatus);
router.get('/', authMiddleware, getOrders);
router.get('/history', authMiddleware, getOrderHistory)

module.exports = router;

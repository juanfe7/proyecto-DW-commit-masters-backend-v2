const express = require('express');
const router = express.Router();
const { createOrder, getOrderStatus, getOrders, getOrderHistory, updateOrderStatus, getAllOrders } = require('../controllers/orders.controller');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, createOrder);
router.get('/:id/status', authMiddleware, getOrderStatus);
router.get('/', authMiddleware, getOrders);
router.get('/history', authMiddleware, getOrderHistory)
router.patch('/:id/status', authMiddleware, updateOrderStatus);
router.get('/all', authMiddleware, getAllOrders);

module.exports = router;

const express = require('express');
const router = express.Router();
const { createOrder, getOrderStatus, getOrders, getOrderHistory, updateOrderStatus, getAllOrdersForPOS} = require('../controllers/orders.controller');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, createOrder);
router.get('/:id/status', authMiddleware, getOrderStatus);
router.get('/', authMiddleware, getOrders);
router.get('/history', authMiddleware, getOrderHistory)
router.get('/all', authMiddleware, getAllOrdersForPOS);
router.patch('/:id/status', authMiddleware, updateOrderStatus);

module.exports = router;

const express = require('express');
const router = express.Router();
const { createReview, getAllReviews, getReviewsByProduct, deleteReview } = require('../controllers/reviews.controller');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, createReview);
router.get('/', authMiddleware, getAllReviews);
router.get('/:docId', authMiddleware, getReviewsByProduct);
router.delete('/:id', authMiddleware, deleteReview);

module.exports = router;

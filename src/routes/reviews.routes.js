const express = require('express');
const router = express.Router();
const { createReview } = require('../controllers/reviews.controller');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, createReview);

module.exports = router;

const express = require('express');
const router = express.Router();
const { obtainProducts, createProduct, getProductById } = require('../controllers/products.controller');
const authMiddleware = require('../middleware/authMiddleware'); // Import the authentication middleware

router.get('/', authMiddleware, obtainProducts); // Nedds authentication middleware

// POST /api/productos
router.post('/', authMiddleware, createProduct); // Nedds authentication middleware

// GET /api/productos/:id
router.get('/:id', authMiddleware, getProductById); // Nedds authentication middleware

module.exports = router;
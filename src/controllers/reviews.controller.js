const { db } = require('../config/firebase');

const createReview = async (req, res) => {
  try {
    const { docId, rating, comment } = req.body;
    const email = req.user.email;

    // Validación de campos
    if (!docId || !rating || !comment) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'La calificación debe ser un número entre 1 y 5' });
    }

    // Validar que el producto exista
    const productRef = db.collection('products').doc(docId);
    const productDoc = await productRef.get();

    if (!productDoc.exists) {
      return res.status(404).json({ message: 'El producto no existe' });
    }

    const productData = productDoc.data();
    const productName = productData.name || 'Producto sin nombre';

    const newReview = {
      productName,
      docId,
      rating,
      comment,
      email: email,
      createdAt: new Date().toISOString(),
    };

    await db.collection('reviews').add(newReview);

    res.status(201).json({ message: 'Reseña creada exitosamente' });
  } catch (error) {
    console.error('Error al crear reseña:', error);
    res.status(500).json({ message: 'Error al crear reseña' });
  }
};

module.exports = { createReview };

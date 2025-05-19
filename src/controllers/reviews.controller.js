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

// Obtener reseñas por ID de producto
const getReviewsByProduct = async (req, res) => {
  try {
    const { docId } = req.params;// Obtener el ID del producto desde los parámetros de la solicitud

    if (!docId) {
      return res.status(400).json({ message: 'Se requiere el ID del producto' });
    }

    const snapshot = await db.collection('reviews')
      .where('docId', '==', docId)
      .orderBy('createdAt', 'desc')
      .get();

    const reviews = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.status(200).json(reviews);
  } catch (error) {
    console.error('Error al obtener reseñas:', error);
    res.status(500).json({ message: 'Error al obtener reseñas' });
  }
};

// Obtener todas las reseñas, sin importar el email
const getAllReviews = async (req, res) => {
  try {
    const snapshot = await db.collection('reviews').orderBy('createdAt', 'desc').get();

    if (snapshot.empty) {
      return res.status(404).json({ message: 'No se encontraron reseñas' });
    }

    // Mapear los documentos a un formato más manejable
    const reviews = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return res.status(200).json(reviews);
  } catch (error) {
    console.error('Error al obtener todas las reseñas:', error);
    return res.status(500).json({ message: 'Error del servidor' });
  }
}


const deleteReview = async (req, res) => {
  const { docId } = req.params;

  try {
    const reviewRef = db.collection('reviews').doc(docId);
    const reviewSnap = await reviewRef.get();// Obtener la referencia al documento de la reseña

    if (!reviewSnap.exists) {
      return res.status(404).json({ message: 'Reseña no encontrada' });
    }

    await reviewRef.delete();
    return res.status(200).json({ message: 'Reseña eliminada con éxito' });
  } catch (error) {
    console.error('Error al eliminar reseña:', error);
    return res.status(500).json({ message: 'Error del servidor' });
  }
};


module.exports = { createReview, getReviewsByProduct, getAllReviews, deleteReview };

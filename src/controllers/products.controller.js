const { db } = require('../config/firebase');



// ✅ Endpoint con filtros por categoría, location y precio
const obtainProducts = async (req, res) => {
  try {
    const { location, category, minPrice, maxPrice, name } = req.query;
    let query = db.collection('products');

    // Filtrar por nombre si se proporciona
    if (name) {
      query = query.where('name', '>=', name).where('name', '<', name + '\uf8ff');
    }

    // Filtrar por ubicación si se proporciona
    if (location) {
      query = query.where('location', '==', location);
    }

    // Filtrar por categoría si se proporciona
    if (category) {
      query = query.where('category', '==', category);
    }

    // Filtrar por precio mínimo si se proporciona
    if (minPrice) {
      const minPriceNum = parseInt(minPrice);
      if (!isNaN(minPriceNum)) {
        query = query.where('price', '>=', minPriceNum);
      }
    }

    // Filtrar por precio máximo si se proporciona
    if (maxPrice) {
      const maxPriceNum = parseInt(maxPrice);
      if (!isNaN(maxPriceNum)) {
        query = query.where('price', '<=', maxPriceNum);
      }
    }

    const snapshot = await query.get();

    if (snapshot.empty) {
      return res.status(200).json([]); // No se encontraron productos con los filtros
    }

    const products = [];
    snapshot.forEach(doc => {
      products.push({ docId: doc.id, ...doc.data() });
    });

    res.json(products);

  } catch (error) {
    console.error('Error al obtener productos con filtros:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};



// Agregar producto
const createProduct = async (req, res) => {
  const { name, price, stock, category, location, imageUrl } = req.body;

  if (!name || !price || !stock || !category || !location || !imageUrl) {
    return res.status(400).json({ message: 'Faltan campos del producto' });
  }

  try {
    const newProduct = {
      name,
      price,
      stock,
      category,
      location,
      imageUrl
    };

    const docRef = await db.collection('products').add(newProduct);

    res.status(201).json({ message: 'Producto agregado', id: docRef.id });
  } catch (error) {
    console.error('Error al agregar producto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const getProductById = (req, res) => {
  const id = parseInt(req.params.id)
  const product = products.find(p => p.id === id)
  if (!product) return res.status(404).json({ message: 'No encontrado' })
  res.json(product)
}

module.exports = { obtainProducts, createProduct, getProductById }

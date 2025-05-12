const { db } = require('../config/firebase');


// ✅ Endpoint con filtros por categoría, location y precio
const obtainProducts = async (req, res) => {
  try {
    const { category, minPrice, maxPrice, name, location } = req.query;
    let productsRef = db.collection('products');

    // Filtrar por categoría
    if (category) {
      productsRef = productsRef.where('category', '==', category);
    }

    // Filtrar por precio (rango)
    if (minPrice) {
      productsRef = productsRef.where('price', '>=', Number(minPrice));
    }
    if (maxPrice) {
      productsRef = productsRef.where('price', '<=', Number(maxPrice));
    }

    // Filtrar por nombre (búsqueda parcial - requiere indexación en Firestore)
    if (name) {
      productsRef = productsRef.where('name', '>=', name).where('name', '<=', name + '\uf8ff');
    }

    // Filtrar por ubicación
    if (location) {
      productsRef = productsRef.where('location', '==', location);
    }

    const snapshot = await productsRef.get();
    const products = snapshot.docs.map(doc => ({
      docId: doc.id,
      ...doc.data()
    }));

    res.json(products);
  } catch (error) {
    console.error('Error al obtener productos con filtros:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};



// Agregar producto
const createProduct = async (req, res) => {
  const { name, price, stock, category, location, image } = req.body;

  if (!name || !price || !stock || !category || !location || !image) {
    return res.status(400).json({ message: 'Faltan campos del producto' });
  }

  try {
    // Obtener todos los productos para calcular el siguiente ID
    const snapshot = await db.collection('products').get();
    const allProducts = snapshot.docs.map(doc => doc.data());
    const maxId = Math.max(...allProducts.map(p => p.id || 0), 0);
    const nextId = maxId + 1;

    const newProduct = {
      id: nextId, // 👈 ID numérico secuencial
      name,
      price,
      stock,
      category,
      location,
      image
    };

    const docRef = await db.collection('products').add(newProduct);

    res.status(201).json({ message: 'Producto creado', id: docRef.id });
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({ error: 'Error al crear producto' });
  }
};



// Obtener producto por ID
const getProductById = async (req, res) => {
  const { id } = req.params; // El 'id' que viene en la URL

  try {
    // Convertir el id del parámetro a número para la búsqueda
    const productIdToFind = parseInt(id);

    const snapshot = await db.collection('products')
      .where('id', '==', productIdToFind)
      .get();

    if (snapshot.empty) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    // Si la consulta devuelve resultados (debería ser solo uno si 'id' es único)
    snapshot.forEach(doc => {
      const product = { docId: doc.id, ...doc.data() };
      res.json(product); // Respondemos con el producto encontrado
    });

  } catch (error) {
    console.error('Error al obtener producto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};


const updateProduct = async (req, res) => {
  const { id } = req.params; // El 'id' que viene en la URL
  const updates = req.body; // Los campos a actualizar vendrán en el cuerpo de la petición

  try {
    // Convertir el id del parámetro a número para la búsqueda
    const productIdToFind = parseInt(id);

    const snapshot = await db.collection('products')
      .where('id', '==', productIdToFind)
      .get();

    if (snapshot.empty) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    // Si la consulta devuelve resultados (debería ser solo uno si 'id' es único)
    snapshot.forEach(async doc => {
      await db.collection('products').doc(doc.id).update(updates);
      const updatedDoc = await db.collection('products').doc(doc.id).get();
      const updatedProduct = { docId: updatedDoc.id, ...updatedDoc.data() };
      res.json(updatedProduct); // Respondemos con el producto actualizado
    });

  } catch (error) {
    console.error('Error al editar producto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// eliminar producto
const deleteProduct = async (req, res) => {
  const { id } = req.params; // El 'id' que viene en la URL

  try {
    // Convertir el id del parámetro a número para la búsqueda
    const productIdToFind = parseInt(id);

    const snapshot = await db.collection('products')
      .where('id', '==', productIdToFind)
      .get();

    if (snapshot.empty) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    // Si la consulta devuelve resultados (debería ser solo uno si 'id' es único)
    snapshot.forEach(async doc => {
      await db.collection('products').doc(doc.id).delete();
      res.json({ message: 'Producto eliminado' }); // Respondemos con un mensaje de éxito
    });

  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};






module.exports = { obtainProducts, createProduct, getProductById, updateProduct, deleteProduct };

// Simula una base de datos con productos reales
let products = [
  // Embarcadero
  { id: 1, name: 'Hamburguesa Clásica', category: 'comida', price: 12000, stock: 10, location: 'Embarcadero', image: 'https://i.imgur.com/L2rwa6l.jpeg' },
  { id: 2, name: 'Limonada Natural', category: 'bebida', price: 3500, stock: 20, location: 'Embarcadero', image: 'https://i.imgur.com/HKQZ4kS.jpg' },

  // Mesón
  { id: 3, name: 'Arepa con Queso', category: 'comida', price: 4000, stock: 12, location: 'Mesón', image: 'https://cocina-casera.com/wp-content/uploads/2023/01/receta-arepas-queso-colombaias.jpg' },
  { id: 4, name: 'Café Negro', category: 'bebida', price: 2000, stock: 30, location: 'Mesón', image: 'https://i.imgur.com/gV0g3rB.jpg' },

  // Restaurante Escuela
  { id: 5, name: 'Filete de Pollo', category: 'comida', price: 15000, stock: 8, location: 'Restaurante Escuela', image: 'https://www.antojitostipicosdelvalle.com/wp-content/uploads/2023/01/filete-pechuga-pollo-plancha-.jpg' },
  { id: 6, name: 'Jugo de Mango', category: 'bebida', price: 4500, stock: 15, location: 'Restaurante Escuela', image: 'https://i.imgur.com/3U3x6bD.jpg' },

  // Arcos
  { id: 7, name: 'Pizza Personal', category: 'comida', price: 11000, stock: 6, location: 'Arcos', image: 'https://www.cobsbread.com/wp-content/uploads/2022/09/Pepperoni-pizza-850x630-1-585x400-1.jpg' },
  { id: 8, name: 'Té Helado', category: 'bebida', price: 3000, stock: 18, location: 'Arcos', image: 'https://i.imgur.com/ZVfP1uU.jpg' },

  // Punto Wok
  { id: 9, name: 'Arroz con Verduras', category: 'comida', price: 10000, stock: 10, location: 'Punto Wok', image: 'https://www.hola.com/horizon/landscape/60ad55eaa6f3-arroz-verduras-adobe-t.jpg' },
  { id: 10, name: 'Agua en Botella', category: 'bebida', price: 2000, stock: 25, location: 'Punto Wok', image: 'https://i.imgur.com/LgP5PPO.jpg' },

  // Punto Sándwich
  { id: 11, name: 'Sándwich de Pollo', category: 'comida', price: 9500, stock: 9, location: 'Punto Sándwich', image: 'https://i.imgur.com/lU6BRpY.jpg' },
  { id: 12, name: 'Malteada de Vainilla', category: 'bebida', price: 5000, stock: 10, location: 'Punto Sándwich', image: 'https://i.imgur.com/WP5y1K6.jpg' },

  // Punto Crepes
  { id: 13, name: 'Crepe de Jamón y Queso', category: 'comida', price: 10500, stock: 7, location: 'Punto Crepes', image: 'https://i.imgur.com/SmvH4iC.jpg' },
  { id: 14, name: 'Smoothie de Fresa', category: 'bebida', price: 5500, stock: 12, location: 'Punto Crepes', image: 'https://i.imgur.com/xPUPmRh.jpg' },

  // Terraza Living Lab
  { id: 15, name: 'Ensalada César', category: 'comida', price: 9000, stock: 11, location: 'Terraza Living Lab', image: 'https://i.imgur.com/Rc9sdB8.jpg' },
  { id: 16, name: 'Coca-Cola', category: 'bebida', price: 2500, stock: 30, location: 'Terraza Living Lab', image: 'https://i.imgur.com/62vJmYk.jpg' },

  // Terraza Restaurante Escuela
  { id: 17, name: 'Lomo en Salsa', category: 'comida', price: 16000, stock: 5, location: 'Terraza Restaurante Escuela', image: 'https://i.imgur.com/jI13fYB.jpg' },
  { id: 18, name: 'Té Verde', category: 'bebida', price: 3500, stock: 14, location: 'Terraza Restaurante Escuela', image: 'https://i.imgur.com/U4HchZQ.jpg' },

  // Kioskos
  { id: 19, name: 'Chorizo con Arepa', category: 'comida', price: 5000, stock: 10, location: 'Kioskos', image: 'https://i.imgur.com/7z1KZyM.jpg' },
  { id: 20, name: 'Gaseosa Colombiana', category: 'bebida', price: 3000, stock: 20, location: 'Kioskos', image: 'https://i.imgur.com/KDjBzU4.jpg' },

  // Banderitas
  { id: 21, name: 'Empanada de Pollo', category: 'comida', price: 3000, stock: 20, location: 'Banderitas', image: 'https://i.imgur.com/J5lT3Yc.jpg' },
  { id: 22, name: 'Refresco de Maracuyá', category: 'bebida', price: 3200, stock: 15, location: 'Banderitas', image: 'https://i.imgur.com/nLBfnx7.jpg' },

  // Cipreses
  { id: 23, name: 'Pastel de Pollo', category: 'comida', price: 4500, stock: 12, location: 'Cipreses', image: 'https://i.imgur.com/XruwzL2.jpg' },
  { id: 24, name: 'Avena Fría', category: 'bebida', price: 2500, stock: 20, location: 'Cipreses', image: 'https://i.imgur.com/Kt9qWrx.jpg' }
];

// ✅ Endpoint con filtros por categoría, location y precio
const obtainProducts = (req, res) => {
  let filtered = [...products];

  const { category, minPrice, maxPrice, location } = req.query;

  if (category) {
    filtered = filtered.filter(p => p.category === category);
  }

  if (minPrice) {
    filtered = filtered.filter(p => p.price >= parseFloat(minPrice));
  }

  if (maxPrice) {
    filtered = filtered.filter(p => p.price <= parseFloat(maxPrice));
  }

  if (location) {
    filtered = filtered.filter(p => p.location.toLowerCase().includes(location.toLowerCase()));
  }

  res.json(filtered);
};



const createProduct = (req, res) => {
  const newProduct = { id: products.length + 1, ...req.body }
  if (!newProduct.name || !newProduct.price || !newProduct.stock|| !newProduct.category || !newProduct.image || !newProduct.location) {
    return res.status(400).json({ message: 'Faltan datos del producto' })
  }
  products.push(newProduct)
  res.status(201).json({ message: 'Producto creado', product: newProduct })
}

const getProductById = (req, res) => {
  const id = parseInt(req.params.id)
  const product = products.find(p => p.id === id)
  if (!product) return res.status(404).json({ message: 'No encontrado' })
  res.json(product)
}

module.exports = { obtainProducts, createProduct, getProductById }

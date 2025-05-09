// Cargar .env solo en desarrollo local
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const { db } = require('./config/firebase');
const express = require('express');
const cors = require('cors');
const app = express();
const productsRoutes = require('./routes/products.routes');
const loginRoutes = require('./routes/login.routes');



console.log('FIREBASE_PROJECT_ID:', process.env.FIREBASE_PROJECT_ID);
console.log('FIREBASE_PRIVATE_KEY (primeros 20 chars):', process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.substring(0, 20) : 'undefined');
// Imprime otras variables clave también


// Middleware
app.use(cors());
app.use(express.json());

// Ruta base para probar funcionamiento
app.get('/', (req, res) => {
  console.log('✅ Entró a /');
  res.send('Servidor funcionando');
});

// Rutas
app.use('/api/products', productsRoutes);
app.use('/api/login', loginRoutes);

// Middleware global de manejo de errores
app.use((err, req, res, next) => {
  console.error('🔴 Error inesperado:', err);
  res.status(500).json({ error: 'Error interno del servidor' });
});





// Exportar la app para que Vercel la use como función serverless
module.exports = app; 


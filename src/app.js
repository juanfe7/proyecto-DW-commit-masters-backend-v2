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
const ordersRoutes = require('./routes/orders.routes');
const reviewsRoutes = require('./routes/reviews.routes');
const notificationsRoutes = require('./routes/notifications.routes');



console.log('FIREBASE_PROJECT_ID:', process.env.FIREBASE_PROJECT_ID);
console.log('FIREBASE_PRIVATE_KEY (primeros 20 chars):', process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.substring(0, 20) : 'undefined');
// Imprime otras variables clave también


// Middleware
app.use(cors());
app.use(express.json());

// ruta base 
app.get('/', (req, res) => {
  console.log('✅ Entró a /');
  res.send('Servidor funcionando');
});

// rutas
app.use('/api/products', productsRoutes);
app.use('/api/login', loginRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/notifications', notificationsRoutes);

// Middleware global de manejo de errores
app.use((err, req, res, next) => {
  console.error('🔴 Error inesperado:', err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));




// Exportar la app para que Vercel la use como función serverless
module.exports = app; 


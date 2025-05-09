const express = require('express');
const cors = require('cors');
const app = express();
const productsRoutes = require('./routes/products.routes');
const loginRoutes = require('./routes/login.routes');

// Cargar .env solo en desarrollo local
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

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


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));


// Exportar la app para que Vercel la use como función serverless
module.exports = app;

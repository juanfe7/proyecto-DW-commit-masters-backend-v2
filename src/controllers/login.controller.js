const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db } = require('../config/firebase');


const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Usuario y contraseña son requeridos' });
  }

  try {
    const snapshot = await db.collection('users').where('email', '==', email).get();

    if (snapshot.empty) {
      return res.status(401).json({ error: 'El usuario o contraseña es incorrecto' });
    }

    const doc = snapshot.docs[0];
    const user = doc.data();

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'El usuario o contraseña es incorrecto' });

    const payload = { id: user.id, rol: user.rol, email: user.email, name: user.name };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, rol: user.rol, name: user.name });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};



module.exports = { login };

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db } = require('../config/firebase');


const login = async (req, res) => {
  const { email, password } = req.body; // Extraer email y password del cuerpo de la solicitud

  if (!email || !password) {
    return res.status(400).json({ error: 'Usuario y contraseña son requeridos' });
  }

  try {
    const snapshot = await db.collection('users').where('email', '==', email).get();// Buscar el usuario por email en la colección 'users'

    if (snapshot.empty) {
      return res.status(401).json({ error: 'El usuario o contraseña es incorrecto' });
    }

    const doc = snapshot.docs[0];// Obtener el primer documento que coincide con la consulta
    const user = doc.data();// Obtener los datos del usuario

    const match = await bcrypt.compare(password, user.password);// Comparar la contraseña proporcionada con la almacenada en la base de datos
    if (!match) return res.status(401).json({ error: 'El usuario o contraseña es incorrecto' });

    const payload = { id: user.id, rol: user.rol, email: user.email, name: user.name };
    const token = jwt.sign({ id: user.id, role: user.rol, name: user.name, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });// Crear un token JWT con los datos del usuario y una clave secreta

    res.json({ id: user.id, token, rol: user.rol, name: user.name, email: user.email });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};



module.exports = { login };

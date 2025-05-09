const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Simulated database of users (for demonstration purposes only)
const users = [
  {
    id: 1,
    email: '111111',
    password: '$2b$10$.idCHuUCydBGjWkVZPPIjee1qS/Frtr1yBTcgl/R01ILWjjKGnMyy', // "Sabana1!"
    rol: 'cliente'
  },
  {
    id: 2,
    email: '222222',
    password: '$2b$10$EyXSVpaq.D0fF9oBNlaNNetz1DP1XxzbntV4zISJ3PwpMBXJ4S2uy', // "Sabana2!"
    rol: 'pos'
  }
];

// Login controller function
const login = async (req, res) => {
  const { email, password } = req.body;

  // Validate request body
  if (!email || !password) {
    return res.status(400).json({ error: 'Usuario y contraseña son requeridos' });
  } 
  const user = users.find(u => u.email === email);
  if (!user) return res.status(401).json({ error: 'Usuario no encontrado' });
  
  // Compare the password with the hashed password in the database
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ error: 'Contraseña incorrecta' });

  // Generate JWT token
  // The payload can include user information such as id, role, etc.
  const payload = { id: user.id, rol: user.rol, email: user.email };
  const token = jwt.sign({ id: user.id, role: user.rol }, process.env.JWT_SECRET, { expiresIn: '1h' });


  res.json({ token, rol: user.rol });
};

module.exports = { login };

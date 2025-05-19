const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // obtener el token del encabezado de autorización
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Acceso no autorizado: Token no proporcionado' });
  }

  const token = authHeader.split(' ')[1]; // Extraer el token del encabezado después de 'Bearer '

  try {
    // Verificar el token usando la clave secreta
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Almacenar la información del usuario decodificada en el objeto de solicitud
    req.user = decoded;

    // Continuar con la siguiente función de middleware o controlador
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Acceso no autorizado: Token inválido' });
  }
};

module.exports = authMiddleware;
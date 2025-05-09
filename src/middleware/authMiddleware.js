const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Obtain the header token from the request
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Acceso no autorizado: Token no proporcionado' });
  }

  const token = authHeader.split(' ')[1]; // extract the token after the 'Bearer '

  try {
    // Verify the token using the secret key
    // The secret key should be stored in an environment variable for security
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the decoded user information to the request object for later use in routes
    req.user = decoded;

    // Move to the next middleware or controller in the route
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Acceso no autorizado: Token inválido' });
  }
};

module.exports = authMiddleware;
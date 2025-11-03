
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'secret_ecom';

module.exports = (req, res, next) => {

  const token = req.cookies?.token || (req.header('Authorization') ? req.header('Authorization').replace('Bearer ', '') : null);

  if (!token) return res.status(401).json({ message: 'Token não fornecido' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
   
    req.user = { id: decoded.id };
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido' });
  }
};

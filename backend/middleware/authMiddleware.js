// backend/middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET || "secret_ecom";

module.exports = async (req, res, next) => {
  // Extrai token do header Authorization (formato: Bearer <token>)
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.startsWith("Bearer ")
    ? authHeader.slice(7) // Remove "Bearer "
    : null;

  if (!token) {
    return res.status(401).json({ error: "Token não fornecido" });
  }

  try {
    // Verifica e decodifica o token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Opcional (mas recomendado): buscar o usuário no banco para garantir que ainda existe
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ error: "Usuário não encontrado" });
    }

    // Salva o usuário inteiro (sem senha) em req.user — compatível com suas rotas
    req.user = user;

    next();
  } catch (err) {
    console.error("Erro de autenticação:", err.message);
    return res.status(401).json({ error: "Token inválido ou expirado" });
  }
};
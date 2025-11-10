
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET || "secret_ecom";

module.exports = async (req, res, next) => {

  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.startsWith("Bearer ")
    ? authHeader.slice(7) 
    : null;

  if (!token) {
    return res.status(401).json({ error: "Token não fornecido" });
  }

  try {

    const decoded = jwt.verify(token, JWT_SECRET);

   
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ error: "Usuário não encontrado" });
    }


    req.user = user;

    next();
  } catch (err) {
    console.error("Erro de autenticação:", err.message);
    return res.status(401).json({ error: "Token inválido ou expirado" });
  }
};
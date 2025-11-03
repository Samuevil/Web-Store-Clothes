const express = require("express");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user)
      return res.status(404).json({ error: "Usuário não encontrado" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar usuário" });
  }
});


router.put("/update", authMiddleware, async (req, res) => {
  try {
    const { name, address, city, state, zip, phone } = req.body;
    const user = await User.findById(req.userId);

    if (!user)
      return res.status(404).json({ error: "Usuário não encontrado" });

    user.name = name || user.name;
    user.address = address || user.address;
    user.city = city || user.city;
    user.state = state || user.state;
    user.zip = zip || user.zip;
    user.phone = phone || user.phone;

    await user.save();

    res.json({ message: "Informações atualizadas com sucesso!" });
  } catch (err) {
    console.error("Erro ao atualizar perfil:", err);
    res.status(500).json({ error: "Erro ao atualizar perfil" });
  }
});

module.exports = router;

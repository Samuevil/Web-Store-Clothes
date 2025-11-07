const express = require("express");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");
const CPF = require('@fnando/cpf'); // ✅ Pacote correto

const router = express.Router();

router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user)
      return res.status(404).json({ error: "Usuário não encontrado" });
    res.json(user);
  } catch (err) {
    console.error("Erro ao buscar usuário:", err);
    res.status(500).json({ error: "Erro ao buscar usuário" });
  }
});

router.put("/update", authMiddleware, async (req, res) => {
  try {
    const { name, phone, cpf, address } = req.body;

    const user = await User.findById(req.user.id);
    if (!user)
      return res.status(404).json({ error: "Usuário não encontrado" });

    // ✅ Validação de CPF com @fnando/cpf
    if (cpf !== undefined) {
      const cpfLimpo = cpf.replace(/\D/g, '');

      if (cpfLimpo === '') {
        user.cpf = undefined;
      } else {
        if (!CPF.isValid(cpfLimpo)) {
          return res.status(400).json({ error: "CPF inválido. Verifique o número e tente novamente." });
        }
        user.cpf = cpfLimpo;
      }
    }

    if (name !== undefined) user.name = name;
    if (phone !== undefined) user.phone = phone;

    if (address && typeof address === 'object') {
      user.address = {
        street: address.street || user.address?.street || '',
        number: address.number || user.address?.number || '',
        neighborhood: address.neighborhood || user.address?.neighborhood || '',
        complement: address.complement || user.address?.complement || '',
        city: address.city || user.address?.city || '',
        state: address.state || user.address?.state || '',
        zip: address.zip || user.address?.zip || ''
      };
    }

    await user.save();
    const updatedUser = await User.findById(user._id).select("-password");
    res.json(updatedUser);
  } catch (err) {
    console.error("Erro ao atualizar perfil:", err);
    res.status(500).json({ error: "Erro ao atualizar perfil" });
  }
});

module.exports = router;
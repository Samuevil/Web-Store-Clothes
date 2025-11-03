const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const nodemailer = require("nodemailer");

const router = express.Router();
const JWT_SECRET = "segredo_super_secreto";

// --- Configura o transporte de e-mail ---
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((error) => {
  if (error) {
    console.error("❌ Erro no Nodemailer:", error);
  } else {
    console.log("✅ Servidor de e-mail pronto para enviar mensagens!");
  }
});

// --- REGISTRAR ---
router.post("/register", async (req, res) => {
  try {
    let { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ error: "Preencha todos os campos" });

    email = email.toLowerCase();
    const existingUser = await User.findOne({ email });

    if (existingUser)
      return res.status(400).json({ error: "Usuário já existe" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      verificationCode,
      verified: false,
    });

    await newUser.save();

    await transporter.sendMail({
      from: `"Sua Loja" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Código de verificação",
      text: `Seu código de verificação é: ${verificationCode}`,
    });

    console.log(`✅ E-mail de verificação enviado para ${email} (${verificationCode})`);
    res.status(201).json({ success: true, message: "Código enviado para seu e-mail." });
  } catch (err) {
    console.error("❌ Erro no registro:", err);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
});

// --- VERIFICAR CÓDIGO DE REGISTRO ---
router.post("/register-verify", async (req, res) => {
  try {
    let { email, code } = req.body;
    email = email.toLowerCase().trim();
    code = code.trim();

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Usuário não encontrado" });

    console.log("🔍 Tentando verificar:", { email, code, codeNoBD: user.verificationCode });

    if (String(user.verificationCode) !== String(code)) {
      return res.status(400).json({ error: "Código incorreto" });
    }

    user.verified = true;
    user.verificationCode = null;
    await user.save();

    res.json({ success: true, message: "Verificação concluída!" });
  } catch (err) {
    console.error("❌ Erro na verificação:", err);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
});

// --- LOGIN (passo 1: envio de código) ---
router.post("/login", async (req, res) => {
  try {
    let { email, password } = req.body;
    email = email.toLowerCase();

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Usuário não encontrado" });

    if (!user.verified)
      return res.status(400).json({ error: "Verifique seu e-mail antes de fazer login." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ error: "Senha incorreta" });

    const loginCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.verificationCode = loginCode;
    await user.save();

    await transporter.sendMail({
      from: `"Sua Loja" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Código de login",
      text: `Seu código de login é: ${loginCode}`,
    });

    console.log(`📧 Código de login enviado para ${email}: ${loginCode}`);
    res.json({ success: true, message: "Código de login enviado para seu e-mail." });
  } catch (err) {
    console.error("❌ Erro no login:", err);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
});


router.post("/verify-code", async (req, res) => {
  try {
    let { email, code } = req.body;
    email = email.toLowerCase().trim();
    code = code.trim();

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Usuário não encontrado" });

    console.log("🔍 Verificando código de login:", { email, code, codeNoBD: user.verificationCode });

    if (String(user.verificationCode) !== String(code))
      return res.status(400).json({ error: "Código incorreto" });

    user.verificationCode = null;
    await user.save();

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ success: true, token });
  } catch (err) {
    console.error("❌ Erro ao verificar código de login:", err);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
});

module.exports = router;

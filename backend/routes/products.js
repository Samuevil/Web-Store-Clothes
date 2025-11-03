const express = require("express");
const router = express.Router();
const Product = require("../models/Product");


router.get("/all", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar produtos" });
  }
});


router.get("/popularinwomen", async (req, res) => {
  try {
    const products = await Product.find({ category: "women" }).limit(8);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar produtos populares" });
  }
});


router.get("/newcollections", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 }).limit(10);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar nova coleção" });
  }
});

module.exports = router;

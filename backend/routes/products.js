// backend/routes/product.js
const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const multer = require("multer");
const path = require("path");

// Configuração do Multer
const storage = multer.diskStorage({
  destination: "./uploads/images",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});
const upload = multer({ storage });

// Rota para adicionar produto
router.post("/addproduct", upload.array("images", 20), async (req, res) => {
  try {
    const {
      name,
      category,
      short_description,
      long_description,
      old_price,
      new_price,
      variations
    } = req.body;

    // ✅ Converte preços para número
    const newPriceNum = parseFloat(new_price);
    const oldPriceNum = old_price ? parseFloat(old_price) : undefined;

    // ✅ Validação
    if (isNaN(newPriceNum) || newPriceNum <= 0) {
      return res.status(400).json({ error: "Preço atual é obrigatório e deve ser maior que zero." });
    }

    // Processa variações
    const variationsArray = JSON.parse(variations);
    let imageIndex = 0;
    const variants = variationsArray.map(variant => {
      const imageCount = variant.imageCount || 0;
      const images = [];
      for (let i = 0; i < imageCount; i++) {
        if (req.files && req.files[imageIndex]) {
          images.push(`/images/${req.files[imageIndex].filename}`);
          imageIndex++;
        }
      }
      return {
        color: variant.color,
        colorCode: variant.colorCode,
        images,
        sizes: variant.sizes
      };
    });

    // ✅ Cria produto
    const newProduct = new Product({
      name,
      category,
      short_description,
      long_description,
      old_price: oldPriceNum,
      new_price: newPriceNum, // ✅ Número válido
      variants
    });

    await newProduct.save();
    res.status(201).json({ success: true, message: "Produto criado com sucesso!" });
  } catch (err) {
    console.error("Erro ao criar produto:", err);
    res.status(500).json({ error: "Erro ao criar produto" });
  }
});

// ✅ Rota para buscar todos os produtos
router.get("/all", async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (err) {
    console.error("Erro ao buscar produtos:", err);
    res.status(500).json({ error: "Erro ao buscar produtos" });
  }
});

// ✅ Rota para deletar produto
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.json({ success: true, message: "Produto excluído com sucesso!" });
  } catch (err) {
    console.error("Erro ao excluir produto:", err);
    res.status(500).json({ error: "Erro ao excluir produto" });
  }
});

// Outras rotas...
router.get("/newcollections", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 }).limit(10);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar novas coleções" });
  }
});

module.exports = router;
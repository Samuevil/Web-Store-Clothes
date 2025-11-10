const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const multer = require("multer");
const path = require("path");

// Configuração do Multer (reutilize sua configuração existente)
const storage = multer.diskStorage({
  destination: "./uploads/images",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});
const upload = multer({ storage });

// Rota para salvar produto com variações
router.post("/addproduct", upload.array("images", 20), async (req, res) => {
  try {
    const {
      name,
      category,
      short_description,
      long_description,
      variations // formato: [{ color, colorCode, sizes: [{ size, stock }] }]
    } = req.body;

    // Organiza as imagens por variação
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

    const newProduct = new Product({
      name,
      category,
      short_description,
      long_description,
      variants
    });

    await newProduct.save();
    res.status(201).json({ success: true, message: "Produto criado com sucesso!" });
  } catch (err) {
    console.error("Erro ao criar produto:", err);
    res.status(500).json({ error: "Erro ao criar produto" });
  }
});

// ✅ Rota para excluir produto por ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verifica se o ID foi fornecido
    if (!id) {
      return res.status(400).json({ error: "ID do produto não fornecido" });
    }

    // Tenta encontrar e excluir o produto
    const deletedProduct = await Product.findByIdAndDelete(id);
    
    // Verifica se o produto existia
    if (!deletedProduct) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }

    res.json({ success: true, message: "Produto excluído com sucesso!" });
  } catch (err) {
    console.error("Erro ao excluir produto:", err);
    res.status(500).json({ error: "Erro ao excluir produto" });
  }
});

// Rota para coleções recentes (com fallback)
router.get("/newcollections", async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    let products = await Product.find({
      createdAt: { $gte: thirtyDaysAgo }
    })
    .sort({ createdAt: -1 })
    .limit(20);

    // Fallback: se não houver novos, pega os mais recentes
    if (products.length === 0) {
      products = await Product.find()
        .sort({ createdAt: -1 })
        .limit(20);
    }

    res.json(products);
  } catch (err) {
    console.error("Erro em newcollections:", err);
    res.status(500).json({ error: "Erro ao buscar coleções" });
  }
});

// Outras rotas (mantenha as que já tem)
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

module.exports = router;
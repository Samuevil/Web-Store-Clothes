// backend/routes/products.js
const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const multer = require("multer");
const path = require("path");
const { isValidObjectId } = require('mongoose'); // Importe a função de validação

// Função para atualizar URLs das imagens (mantida como está)
const updateImageUrls = (products, baseUrl) => {
  const updateProductImages = (product) => {
    if (product.variants) {
      product.variants = product.variants.map(variant => {
        if (variant.images) {
          variant.images = variant.images.map(image => {
            if (image.startsWith('/images/')) {
              return `${baseUrl}${image}`;
            }
            return image;
          });
        }
        return variant;
      });
    }
    return product;
  };

  if (Array.isArray(products)) {
    return products.map(updateProductImages);
  } else {
    // Correção: Se products não for um array, não use map
    return updateProductImages(products);
  }
};

// Configuração do Multer para uploads de produtos (mantida como está)
const storage = multer.diskStorage({
  destination: "./uploads/images",
  filename: (req, file, cb) => {
    const cleanFileName = file.originalname
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[^a-z0-9_\-\.]/g, '');
    cb(null, `${Date.now()}_${cleanFileName}`);
  },
});
const upload = multer({ storage });

// Rota para adicionar produto (mantida como está)
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

    const newPriceNum = parseFloat(new_price);
    const oldPriceNum = old_price ? parseFloat(old_price) : undefined;

    if (isNaN(newPriceNum) || newPriceNum <= 0) {
      return res.status(400).json({ error: "Preço atual é obrigatório e deve ser maior que zero." });
    }

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
      old_price: oldPriceNum,
      new_price: newPriceNum,
      variants
    });

    await newProduct.save();
    res.status(201).json({ success: true, message: "Produto criado com sucesso!" });
  } catch (err) {
    console.error("Erro ao criar produto:", err);
    res.status(500).json({ error: "Erro ao criar produto" });
  }
});

// Rota para buscar todos os produtos (mantida como está)
router.get("/all", async (req, res) => {
  try {
    const products = await Product.find({});
    const baseUrl = `http://localhost:${process.env.PORT || 4000}`;
    const productsWithFullUrls = updateImageUrls(products, baseUrl);
    res.json(productsWithFullUrls);
  } catch (err) {
    console.error("Erro ao buscar produtos:", err);
    res.status(500).json({ error: "Erro ao buscar produtos" });
  }
});

// ROTA ESPECÍFICA: novas coleções - COLOQUE ANTES DE /:id
router.get("/newcollections", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 }).limit(10);
    const baseUrl = `http://localhost:${process.env.PORT || 4000}`;
    const productsWithFullUrls = updateImageUrls(products, baseUrl);
    res.json(productsWithFullUrls);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar novas coleções" });
  }
});

// ROTA ESPECÍFICA: produtos populares em mulheres - COLOQUE ANTES DE /:id
router.get("/popularinwomen", async (req, res) => {
  try {
    // Exemplo de lógica para produtos populares em mulheres
    // Ajuste a lógica conforme sua definição de "popular"
    const products = await Product.find({ category: { $regex: /Feminino/i } }).sort({ createdAt: -1 }).limit(10);
    const baseUrl = `http://localhost:${process.env.PORT || 4000}`;
    const productsWithFullUrls = updateImageUrls(products, baseUrl);
    res.json(productsWithFullUrls);
  } catch (err) {
    console.error("Erro ao buscar produtos populares em mulheres:", err);
    res.status(500).json({ error: "Erro ao buscar produtos populares em mulheres" });
  }
});

module.exports = router;
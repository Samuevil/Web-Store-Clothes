
const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const multer = require("multer");
const path = require("path");


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
    return updateProductImages(products);
  }
};


const storage = multer.diskStorage({
  destination: "./uploads/images",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});
const upload = multer({ storage });


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


router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }
    const baseUrl = `http://localhost:${process.env.PORT || 4000}`;
    const productWithFullUrls = updateImageUrls(product, baseUrl);
    res.json(productWithFullUrls);
  } catch (err) {
    console.error("Erro ao buscar produto:", err);
    res.status(500).json({ error: "Erro ao buscar produto" });
  }
});


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

module.exports = router;
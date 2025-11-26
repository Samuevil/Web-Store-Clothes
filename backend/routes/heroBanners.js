// backend/routes/heroBanners.js
const express = require("express");
const router = express.Router();
const HeroBanner = require("../models/HeroBanner");
const multer = require("multer");
const path = require("path");

// Configuração do Multer para upload de mídia (imagens e vídeos)
const storage = multer.diskStorage({
  destination: "./uploads/media", // Pasta específica para mídia do Hero
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    // Gera nome seguro baseado em timestamp e tipo de mídia
    const filename = `hero_${Date.now()}_${Math.random().toString(36).substring(2, 10)}${ext}`;
    cb(null, filename);
  },
});
// Filtra arquivos permitidos (imagens e vídeos)
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de arquivo não permitido. Apenas imagens e vídeos são aceitos.'), false);
  }
};
const upload = multer({ storage, fileFilter });

// Rota para adicionar banner do Hero
router.post("/addbanner", upload.single("media"), async (req, res) => {
  try {
    const { title, subtitle, buttonText, buttonLink, isActive, order, mediaType } = req.body;

    // Validação do tipo de mídia
    if (!['image', 'video'].includes(mediaType)) {
      return res.status(400).json({ error: "mediaType deve ser 'image' ou 'video'." });
    }

    // Validação de campos obrigatórios
    if (!req.file) {
      return res.status(400).json({ error: "Arquivo de mídia é obrigatório." });
    }
    if (!buttonText || !buttonLink) {
      return res.status(400).json({ error: "ButtonText e ButtonLink são obrigatórios." });
    }

    const newBanner = new HeroBanner({
      title: title || null, // Armazena null se vazio
      subtitle: subtitle || null, // Armazena null se vazio
      mediaType,
      mediaUrl: `/media/${req.file.filename}`, // Caminho relativo para o arquivo
      buttonText,
      buttonLink,
      isActive: isActive === 'true',
      order: parseInt(order) || 0
    });

    await newBanner.save();
    res.status(201).json({ success: true, message: "Banner criado com sucesso!", banner: newBanner });
  } catch (err) {
    console.error("Erro ao criar banner:", err);
    res.status(500).json({ error: "Erro ao criar banner" });
  }
});

// Rota para buscar todos os banners ativos
router.get("/all", async (req, res) => {
  try {
    const banners = await HeroBanner.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    const baseUrl = `http://localhost:${process.env.PORT || 4000}`;

    const bannersWithFullUrls = banners.map(banner => ({
      ...banner._doc,
      mediaUrl: `${baseUrl}${banner.mediaUrl}` // Constrói a URL completa
    }));

    res.json(bannersWithFullUrls);
  } catch (err) {
    console.error("Erro ao buscar banners:", err);
    res.status(500).json({ error: "Erro ao buscar banners" });
  }
});

// Rota para buscar todos os banners (para admin)
router.get("/", async (req, res) => {
  try {
    const banners = await HeroBanner.find().sort({ order: 1, createdAt: -1 });
    const baseUrl = `http://localhost:${process.env.PORT || 4000}`;

    const bannersWithFullUrls = banners.map(banner => ({
      ...banner._doc,
      mediaUrl: `${baseUrl}${banner.mediaUrl}`
    }));

    res.json(bannersWithFullUrls);
  } catch (err) {
    console.error("Erro ao buscar banners:", err);
    res.status(500).json({ error: "Erro ao buscar banners" });
  }
});

// Rota para atualizar banner
router.put("/update/:id", upload.single("media"), async (req, res) => {
  try {
    const { title, subtitle, buttonText, buttonLink, isActive, order, mediaType } = req.body;
    const updates = {
      title: title || null,
      subtitle: subtitle || null,
      buttonText,
      buttonLink,
      isActive: isActive === 'true',
      order: parseInt(order) || 0,
      updatedAt: Date.now()
    };

    // Validação do tipo de mídia
    if (mediaType && !['image', 'video'].includes(mediaType)) {
      return res.status(400).json({ error: "mediaType deve ser 'image' ou 'video'." });
    }

    if (mediaType) {
      updates.mediaType = mediaType;
    }

    // Se houver nova mídia, atualiza o campo mediaUrl
    if (req.file) {
      updates.mediaUrl = `/media/${req.file.filename}`;
    }

    const updatedBanner = await HeroBanner.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    );

    if (!updatedBanner) {
      return res.status(404).json({ error: "Banner não encontrado" });
    }

    res.json({ success: true, message: "Banner atualizado com sucesso!", banner: updatedBanner });
  } catch (err) {
    console.error("Erro ao atualizar banner:", err);
    res.status(500).json({ error: "Erro ao atualizar banner" });
  }
});

// Rota para deletar banner
router.delete("/:id", async (req, res) => {
  try {
    const deletedBanner = await HeroBanner.findByIdAndDelete(req.params.id);
    if (!deletedBanner) {
      return res.status(404).json({ error: "Banner não encontrado" });
    }
    res.json({ success: true, message: "Banner excluído com sucesso!" });
  } catch (err) {
    console.error("Erro ao excluir banner:", err);
    res.status(500).json({ error: "Erro ao excluir banner" });
  }
});

module.exports = router;
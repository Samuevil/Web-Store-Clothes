// backend/models/HeroBanner.js
const mongoose = require('mongoose');

const heroBannerSchema = new mongoose.Schema({
  title: { type: String }, // Agora é opcional
  subtitle: { type: String }, // Agora é opcional
  mediaType: { type: String, enum: ['image', 'video'], required: true }, // Novo campo
  mediaUrl: { type: String, required: true }, // Caminho para imagem ou vídeo
  buttonText: { type: String, required: true },
  buttonLink: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('HeroBanner', heroBannerSchema);
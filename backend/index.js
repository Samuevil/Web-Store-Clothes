// backend/index.js
const express = require("express");
const cors = require("cors");
const path = require("path");
const multer = require("multer");
const connectDB = require("./config/database");
const fs = require("fs"); // Adicionado para criar diretórios
require("dotenv").config();

const app = express();
let PORT = process.env.PORT || 4000;

connectDB();

app.use(express.json());

// ✅ Configuração CORS atualizada - permite múltiplas origens
const allowedOrigins = [
  "http://localhost:3000", // Frontend da loja
  "http://localhost:5173", // Frontend do admin (Vite default)
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Permite requisições sem origem (como Postman, curl, etc.)
      if (!origin) return callback(null, true);
      
      // Verifica se a origem está na lista de permitidas
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Origem não permitida pelo CORS"));
      }
    },
    credentials: true,
  })
);

// Configuração do Multer para uploads de imagens (produtos)
const imageStorage = multer.diskStorage({
  destination: "./uploads/images",
  filename: (req, file, cb) => {
    // Remove espaços e caracteres especiais do nome do arquivo
    const cleanFileName = file.originalname
      .toLowerCase()
      .replace(/\s+/g, '_') // Substitui espaços por underscores
      .replace(/[^a-z0-9_\-\.]/g, ''); // Remove caracteres especiais
    cb(null, `${Date.now()}_${cleanFileName}`);
  },
});
const imageUpload = multer({ storage: imageStorage });

// Configuração do Multer para uploads de mídia do Hero (imagens e vídeos)
const mediaStorage = multer.diskStorage({
  destination: "./uploads/media",
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    // Gera nome seguro baseado em timestamp e tipo de mídia
    const filename = `hero_${Date.now()}_${Math.random().toString(36).substring(2, 10)}${ext}`;
    cb(null, filename);
  },
});
// Filtra arquivos permitidos (imagens e vídeos)
const mediaFileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de arquivo não permitido. Apenas imagens e vídeos são aceitos.'), false);
  }
};
const mediaUpload = multer({ storage: mediaStorage, fileFilter: mediaFileFilter });

// Cria as pastas uploads/images e uploads/media se elas não existirem
const uploadImageDir = path.join(__dirname, "uploads", "images");
const uploadMediaDir = path.join(__dirname, "uploads", "media");
if (!fs.existsSync(uploadImageDir)) {
  fs.mkdirSync(uploadImageDir, { recursive: true });
}
if (!fs.existsSync(uploadMediaDir)) {
  fs.mkdirSync(uploadMediaDir, { recursive: true });
}

// Middleware para servir arquivos estáticos
app.use("/images", express.static(path.join(__dirname, "uploads", "images")));
app.use("/media", express.static(path.join(__dirname, "uploads", "media")));

// Verifique se os arquivos de rota estão exportando corretamente o router
// Exemplo: module.exports = router; (não module.exports = { router: router } ou apenas um objeto)
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const heroBannerRoutes = require("./routes/heroBanners");
const userRoutes = require("./routes/user");

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/hero", heroBannerRoutes);
app.use("/api/user", userRoutes);

app.get("/", (req, res) => {
  res.send("✅ API do E-commerce rodando com sucesso!");
});

const startServer = () => {
  const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`✅ Servidor rodando na porta ${server.address().port}`);
  });

  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.error(`Porta ${PORT} já está em uso. Tentando outra...`);
      PORT = 0;
      startServer();
    } else {
      console.error("Erro ao iniciar servidor:", err);
    }
  });
};

startServer();
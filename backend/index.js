const express = require("express");
const cors = require("cors");
const path = require("path");
const multer = require("multer");
const connectDB = require("./config/database");
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

const storage = multer.diskStorage({
  destination: "./uploads/images",
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage });
app.use("/images", express.static("uploads/images"));

const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const userRoutes = require("./routes/user");

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
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
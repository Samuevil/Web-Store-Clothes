// backend/models/Product.js
const mongoose = require('mongoose'); // ✅ Import obrigatório

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    short_description: String,
    long_description: String,
    old_price: Number,
    new_price: { type: Number, required: true },
    variants: [
      {
        color: { type: String, required: true },
        colorCode: String,
        images: [{ type: String, required: true }],
        sizes: [
          { size: { type: String, required: true }, stock: { type: Number, default: 0, min: 0 } }
        ]
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
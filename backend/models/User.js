const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    cpf: {
      type: String,
      unique: true,
      match:[/^\d{11}$/, "CPF deve conter exatamente 11 dígitos numéricos"],
    },
    

    address: {
      street: String,
      number: String,
      neighborhood: String, 
      complement: String,   
      city: String,
      state: String,
      zip: String
    },
    
    
    phone: { type: String }, 
    
    
    verified: { type: Boolean, default: false },
    verificationCode: { type: String, default: null },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model("User", userSchema);
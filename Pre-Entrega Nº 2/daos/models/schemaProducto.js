import mongoose, { Schema, model } from "mongoose";

const Products_BD = new Schema({
  timestamp: { type: Number, required: true, max: 10000000000000 },
  codigo: { type: String, required: true, max: 100 },
  nombre: { type: String, required: true, max: 100 },
  descripcion: { type: String, required: true },
  precio: { type: Number, required: true, max: 1000000000 },
  foto: { type: String, required: true, max: 300 },
  stock: { type: Number, required: true, max: 100 },
});

module.exports = mongoose.model("productos", Products_BD);

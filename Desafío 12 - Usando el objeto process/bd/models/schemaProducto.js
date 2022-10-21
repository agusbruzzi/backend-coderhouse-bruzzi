const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const Products_BD = new Schema({
  nombre: { type: String, required: true, max: 100 },
  precio: { type: Number, required: true, max: 1000000000 },
  foto: { type: String, required: true, max: 300 },
});

module.exports = mongoose.model('productos', Products_BD);

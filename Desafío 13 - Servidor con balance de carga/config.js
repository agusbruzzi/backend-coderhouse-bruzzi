require('dotenv').config();
const modo = process.argv[2] || 'fork';
const PORT = process.argv[3] || 8000;
module.exports = {
  BD: process.env.MONGO,
  PUERTO: PORT,
  MODO: modo,
};

require('dotenv').config();
const yargs = require('yargs/yargs')(process.argv.slice(2));
const args = yargs.default({
  puerto: 8080,
}).argv;
module.exports = {
  BD: process.env.MONGO,
  PUERTO: args.puerto,
};

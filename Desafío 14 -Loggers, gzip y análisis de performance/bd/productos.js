const { connect } = require('mongoose');
const ProductoSchema = require('./models/schemaProducto');
const config = require('../config');

class Producto {
  async conexionBD() {
    //Hacemoc conexion local
    try {
      return await connect(config.BD, {
        useNewUrlParser: true,
      });
    } catch (e) {
      console.log(e);
    }
  }

  async nuevoProducto(producto) {
    await this.conexionBD();
    await ProductoSchema.create(producto);
    console.log('producto almacenado:', producto);
    return producto;
  }

  async mostrarProductos() {
    await this.conexionBD();
    const productos = await ProductoSchema.find({});
    return productos;
  }
}

module.exports = Producto;

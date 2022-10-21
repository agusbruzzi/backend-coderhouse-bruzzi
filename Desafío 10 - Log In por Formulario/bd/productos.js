const { mongoose, connect } = require('mongoose');
const ProductoSchema = require('./models/schemaProducto');

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = 'mongodb+srv://agusbruzzi:<agusbruzzi123>@cluster0.kkhuuwt.mongodb.net/?retryWrites=true&w=majority';

class Producto {
  async conexionBD() {
    //Hacemoc conexion local
    try {
      return await connect('mongodb+srv://agusbruzzi:agusbruzzi123@cluster0.kkhuuwt.mongodb.net/?retryWrites=true&w=majority', {
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
    mongoose.disconnect();
    return productos;
  }
}

module.exports = Producto;

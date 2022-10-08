import mongoose, { connect } from "mongoose";
const Products = require("./models/schemaProducto");

class Producto {
  async connectMG() {
    //Hacemoc conexion local
    try {
      return await connect("mongodb://localhost:27017/ecommerce", {
        useNewUrlParser: true,
      });
    } catch (e) {
      console.log(e);
    }
  }

  async nuevoProducto(producto) {
    //Asigno timestamp
    producto.timestamp = Date.now();
    //Asigno código
    const caracteres = "abcdefghijkmnpqrtuvwxyzABCDEFGHJKMNPQRTUVWXYZ2346789";
    let codigo = "";
    for (i = 0; i < 20; i++)
      codigo += caracteres.charAt(
        Math.floor(Math.random() * caracteres.length)
      );
    producto.codigo = codigo;

    await this.connectMG();
    await Products.create(producto);
    mongoose.disconnect();
    console.log(productoGuardado);
    return productoGuardado;
  }

  async buscarProductos() {
    console.log("LEER TODOS LOS PRODUCTOS");
    await this.connectMG();
    const productos = await Products.find({});
    console.log(productos);
    mongoose.disconnect();
  }

  async buscarProductoID(idBuscado) {
    await this.connectMG();
    const producto = await Products.find({}).sort({ id: idBuscado }).limit(1);
    console.log(producto);
    mongoose.disconnect();
  }

  async modificarProducto(idProducto, body) {
    await this.connectMG();
    if (body.precio) {
      const productoModificado = await Products.updateOne(
        { id: idProducto },
        { $set: { precio: body.precio } }
      );
      console.log(productoModificado);
      mongoose.disconnect();
    } //Cambia el nombre
    else if (body.nombre) {
      product.nombre = body.nombre;
      const productoModificado = await Products.updateOne(
        { id: idProducto },
        { $set: { nombre: body.nombre } }
      );
      console.log(productoModificado);
      mongoose.disconnect();
    } //Cambia la foto
    else if (body.foto) {
      product.foto = body.foto;
      const productoModificado = await Products.updateOne(
        { id: idProducto },
        { $set: { foto: body.foto } }
      );
      console.log(productoModificado);
      mongoose.disconnect();
    } //Cambia el id, timestamp, código...
    else if (body.id || body.timestamp || body.codigo) {
      console.log({ result: "no puede modificarse" });
      mongoose.disconnect();
    } else {
      console.log({ result: "error" });
      mongoose.disconnect();
    }
  }

  async eliminarProducto(idProducto) {
    await this.connectMG();
    const producto = await Products.deleteOne({ id: idProducto });
    console.log(producto);
    mongoose.disconnect();
  }
}

module.exports = Producto;

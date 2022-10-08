var admin = require("firebase-admin");
const config = require("./bd/e-commerce-agusbruzzi-firebase-adminsdk-jgg6z-68e05d683b.json");

class Carrito {
  constructor() {
    admin.initializeApp({
      credential: admin.credential.cert(config),
    });
  }

  async crearCarrito(carrito) {
    const db = admin.firestore();
    const query = db.collection("carritos");
    let timestamp = new Date();
    try {
      const doc = query.doc();
      const carrito = await doc.create({
        timestamp: timestamp.toString(),
        productos: carrito,
      });
      console.log("Carrito creado");
      return carrito;
    } catch (error) {
      throw Error(error.message);
    }
  }

  async buscarProductosdeCarrito(carrito) {
    const db = admin.firestore();
    const query = db.collection("carritos");
    const doc = query.doc(`${carrito}`);
    const res = await doc.get();
    const response = res.data();
    console.log(response.productos);
  }

  async borrarCarrito(carrito) {
    const db = admin.firestore();
    const query = db.collection("carritos");
    const doc = query.doc(`${carrito}`);
    const res = await doc.delete();
    console.log("Carrito borrado");
  }

  async actualizarCarrito(id, producto) {
    const db = admin.firestore();
    const query = db.collection("carritos");
    const doc = query.doc(`${id}`);
    const res = await doc.get();
    const productosCarrito = res.data().productos;
    productoAgregado = productosCarrito.find((x) => x.id == producto.id);
    if (productoAgregado) {
      //Si el producto ya estaba agregado al carrito modificamos su cantidad
      productoAgregado.stock = productoAgregado.stock + producto.stock;
      const nuevoProducto = await doc.update({ productos: productosCarrito });
      console.log("Carrito actualizado", nuevoProducto);
    } else {
      //Si el producto no estaba en el carrito vamos agregarlo
      productosCarrito.push(producto);
      const nuevoProducto = await doc.update({ productos: productosCarrito });
      console.log("Carrito actualizado", nuevoProducto);
    }
  }

  async borrarProductoCarrito(idCarrito, idProducto) {
    const db = admin.firestore();
    const query = db.collection("carritos");
    const doc = query.doc(`${idCarrito}`);
    const res = await doc.get();
    const productosCarrito = res.data().productos;
    productoEliminado = productosCarrito.find((x) => x.id == idProducto);
    if (productoEliminado) {
      carritoSinProductoEliminado = productosCarrito.filter(
        (x) => x.id != idProducto
      );
      productosCarrito = carritoSinProductoEliminado;
      const eliminado = await doc.update({ productos: productosCarrito });
      console.log("producto eliminado", eliminado);
    } else {
      res.json({ error: "producto no encontrado en el carrito" });
    }
  }
}
module.exports = Carrito;

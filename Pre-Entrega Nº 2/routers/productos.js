const express = require("express");
const { Router } = express;
const routerProducts = Router();
const { productoDaos: Producto } = require("../daos/mainDaos");

const Producto = new Carrito();

routerProducts.get("/", async function (req, res) {
  try {
    const mostrar = await Producto.buscarProductos();
    res.status(200).send({
      status: 200,
      data: {
        carrito,
      },
      message: "productos",
    });
  } catch (error) {
    res.status(500).send({
      status: 500,
      message: error.message,
    });
  }
});

routerProducts.get("/:id", async function (req, res) {
  const id = req.params.id;
  try {
    const mostrarProducto = await Producto.buscarProductoID(id);
    res.status(200).send({
      status: 200,
      data: {
        carrito,
      },
      message: "productos",
    });
  } catch (error) {
    res.status(500).send({
      status: 500,
      message: error.message,
    });
  }
});

routerProducts.post("/", async function (req, res) {
  try {
    const nuevoProducto = await Producto.nuevoProducto(req.body);
    res.status(200).send({
      status: 200,
      data: {
        carrito,
      },
      message: "nuevo producto",
    });
  } catch (error) {
    res.status(500).send({
      status: 500,
      message: error.message,
    });
  }
});

routerProducts.put("/:id", async function (req, res) {
  const id = req.params.id;
  try {
    const cambiado = await Producto.modificarProducto(id, req.body);
    res.status(200).send({
      status: 200,
      data: {
        carrito,
      },
      message: "producto cambiado",
    });
  } catch (error) {
    res.status(500).send({
      status: 500,
      message: error.message,
    });
  }
});

routerProducts.delete("/:id", async function (req, res) {
  const id = req.params.id;
  try {
    const eliminado = await Producto.eliminarProducto(id);
    res.status(200).send({
      status: 200,
      data: {
        carrito,
      },
      message: "producto eliminado",
    });
  } catch (error) {
    res.status(500).send({
      status: 500,
      message: error.message,
    });
  }
});

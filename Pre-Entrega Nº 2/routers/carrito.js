const express = require("express");
const { Router } = express;
const routerCarrito = Router();
const { carritoDaos: Carrito } = require("../daos/mainDaos");

const Carrito = new Carrito();

routerCarrito.post("/", async function (req, res) {
  try {
    const carrito = await Carrito.crearCarrito(req.body);
    res.status(200).send({
      status: 200,
      data: {
        carrito,
      },
      message: "carrito agregado",
    });
  } catch (error) {
    res.status(500).send({
      status: 500,
      message: error.message,
    });
  }
});

routerCarrito.get("/:id/productos", async function (req, res) {
  const { id } = req.params;
  try {
    const buscados = await Carrito.buscarProductosdeCarrito(id);
    res.status(200).send({
      status: 200,
      data: {
        carrito,
      },
      message: "carrito borrado",
    });
  } catch (error) {
    res.status(500).send({
      status: 500,
      message: error.message,
    });
  }
});

routerCarrito.delete("/:id", async function (req, res) {
  const id = req.params.id;
  try {
    const borrado = await Carrito.borrarCarrito(id);
    res.status(200).send({
      status: 200,
      data: {
        carrito,
      },
      message: "carrito borrado",
    });
  } catch (error) {
    res.status(500).send({
      status: 500,
      message: error.message,
    });
  }
});

routerCarrito.post("/:id/productos", async function (req, res) {
  try {
    let idCarrito = req.params.id;
    let idProducto = req.body.id;
    const agregado = await Carrito.actualizarCarrito(idCarrito, idProducto);
    res.status(200).send({
      status: 200,
      data: {
        carrito,
      },
      message: "producto agregado",
    });
  } catch (error) {
    res.status(500).send({
      status: 500,
      message: error.message,
    });
  }
});

routerCarrito.delete("/:id/productos/:id_prod", async function (req, res) {
  const { id } = req.params;
  const idProducto = req.body.id;
  try {
    const eliminado = await Carrito.borrarProductoCarrito(id, idProducto);
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

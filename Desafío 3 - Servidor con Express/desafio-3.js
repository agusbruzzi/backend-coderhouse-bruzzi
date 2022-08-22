const Contenedor = require("../Desafio 2/desafio-2.js");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, () => {
  console.log("Servidor encendido");
});

app.get("/", (req, res) => {
  res.send({
    Desafio3: "Para continuar ingrese: /productos o /productoRandom",
  });
});

app.get("/productos", async (req, res) => {
  res.send(await archivo.getAll());
});

app.get("/productoRandom", async (req, res) => {
  res.send(await archivo.getRandom());
});

const archivo = new Contenedor("./productos.json");

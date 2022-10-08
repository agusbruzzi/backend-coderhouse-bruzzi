const express = require("express");
const app = express();
const routerProducts = require("./routers/productos");
const routerCarrito = require("./routers/carrito");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const administrador = true;

if (administrador) {
  app.use("/api/products", routerProducts);
  app.use("/api/carrito", routerCarrito);
} else {
  console.log("no tiene acceso");
}

const server = app.listen(process.env.PORT || 8080, () => {
  console.log("Servidor encendido");
});

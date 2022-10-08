import express, { json } from "express";
import usuariosRouter from "./router/router.js";

const app = express();

app.use(json());

app.use("/api/usuarios", usuariosRouter);

const PORT = 8080;
const server = app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto http://localhost:${PORT}/`);
});
server.on("error", (error) => console.log(`Error en servidor: ${error}`));

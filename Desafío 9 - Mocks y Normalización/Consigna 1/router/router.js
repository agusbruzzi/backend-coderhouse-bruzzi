import { Router } from "express";
import ApiProductosMock from "../api/productos.js";

const apiProductos = new ApiProductosMock();

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    res.json(await apiProductos.generar(req.query.cant));
  } catch (err) {
    next(err);
  }
});

export default router;

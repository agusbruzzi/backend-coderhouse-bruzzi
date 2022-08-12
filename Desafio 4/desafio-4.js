const express = require("express");
const { Router } = express;
const app = express();
const router = Router();
const PORT = 8080;

app.use("/api/products", router);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static("public"));

const products = [
  {
    id: 1,
    title: "remera",
    price: 500,
    thumbnail:
      "https://deliverind.com.ar/wp-content/uploads/2022/06/REMERA-REGULAR-FIT-SOFT-22-PORTADA-01-scaled.jpg",
  },
  {
    id: 2,
    title: "pantalon",
    price: 900,
    thumbnail:
      "https://deliverind.com.ar/wp-content/uploads/2020/11/UNIDAD-71-scaled.jpg",
  },
  {
    id: 3,
    title: "medias",
    price: 200,
    thumbnail:
      "https://deliverind.com.ar/wp-content/uploads/2021/09/4-10-scaled.jpg",
  },
];

const server = app.listen(PORT, () => {
  console.log("Servidor encendido");
});

router.get("/", (req, res) => {
  res.json(products);
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  product = products.find((x) => x.id == id);
  if (product) {
    res.json(product);
  } else {
    res.json({ error: "producto no encontrado" });
  }
});

router.post("/", (req, res) => {
  const { body } = req;
  let lastID = products[products.length - 1].id;
  body.id = lastID + 1;
  res.json({ sucess: "ok", new: body });
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { body } = req;
  product = products.find((x) => x.id == id);
  if (product) {
    if (body.price) {
      product.price = body.price;
      res.json({ sucess: "ok", new: product });
    } else if (body.title) {
      product.title = body.title;
      res.json({ sucess: "ok", new: product });
    } else if (body.thumbnail) {
      product.thumbnail = body.thumbnail;
      res.json({ sucess: "ok", new: product });
    } else if (body.id) {
      res.json({ result: "no puede modificarse el id" });
    } else {
      res.json({ result: "error" });
    }
  } else {
    res.json({ error: "producto no encontrado" });
  }
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  product = products.find((x) => x.id == id);
  if (product) {
    productsDelete = products.filter((x) => x.id != id);
    res.json({ sucess: "ok", new: productsDelete });
  } else {
    res.json({ error: "producto no encontrado" });
  }
});

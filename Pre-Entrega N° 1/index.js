const express = require("express");
const { Router } = express;
const app = express();
const routerProducts = Router();
const routerCarrito = Router();
var bodyParser = require("body-parser");

app.use("/api/products", routerProducts);
app.use("/api/carrito", routerCarrito);
app.use(express.json());
app.use(bodyParser.json());

app.use("/public", express.static("public"));

var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });

const administrador = true;

let products = [
  {
    id: 1,
    timestamp: 1662007056984,
    nombre: "remera",
    descripcion: "descripción del producto",
    codigo: "FYr3VGWDmyDnKKVVftG9",
    precio: 500,
    foto: "https://deliverind.com.ar/wp-content/uploads/2022/06/REMERA-REGULAR-FIT-SOFT-22-PORTADA-01-scaled.jpg",
    stock: 5,
  },
  {
    id: 2,
    timestamp: 1662007058984,
    nombre: "pantalon",
    descripcion: "descripción del producto",
    codigo: "wD2mPyXZW6R46nKgp9dJ",
    precio: 800,
    foto: "https://deliverind.com.ar/wp-content/uploads/2020/11/UNIDAD-71-scaled.jpg",
    stock: 3,
  },
  {
    id: 3,
    timestamp: 1662007058284,
    nombre: "medias",
    descripcion: "descripción del producto",
    codigo: "62BPB72hk2jgGvM2ZM7r",
    precio: 200,
    foto: "https://deliverind.com.ar/wp-content/uploads/2021/09/4-10-scaled.jpg",
    stock: 6,
  },
];

const server = app.listen(process.env.PORT || 8080, () => {
  console.log("Servidor encendido");
});

routerProducts.get("/", (req, res) => {
  res.json(products);
});

routerProducts.get("/:id", (req, res) => {
  const { id } = req.params;
  product = products.find((x) => x.id == id);
  if (product) {
    res.json(product);
  } else {
    res.json(products);
  }
});

//Solo Admin
routerProducts.post(
  "/",
  (req, res, next) => {
    //Verifico si es admin
    if (!administrador) {
      res.json({ error: "no posee autorización" });
      res.end();
    }
    next();
  },
  jsonParser,
  (req, res) => {
    const { body } = req;
    //Asigno ID
    let lastID = products[products.length - 1].id;
    body.id = lastID + 1;
    //
    //Asigno timestamp
    body.timestamp = Date.now();
    //
    //Asigno código
    const caracteres = "abcdefghijkmnpqrtuvwxyzABCDEFGHJKMNPQRTUVWXYZ2346789";
    let codigo = "";
    for (i = 0; i < 20; i++)
      codigo += caracteres.charAt(
        Math.floor(Math.random() * caracteres.length)
      );
    body.codigo = codigo;
    //El resto de los datos se suponen que se ingresan (nombre, precio, descripción, stock, foto)
    products.push(body);
    res.json({ sucess: "ok", new: body });
  }
);

//Solo Admin
routerProducts.put(
  "/:id",
  (req, res, next) => {
    //Verifico si es admin
    if (!administrador) {
      res.json({ error: "no posee autorización" });
      res.end();
    }
    next();
  },
  jsonParser,
  (req, res) => {
    const { id } = req.params;
    const { body } = req;
    product = products.find((x) => x.id == id);
    if (product) {
      //Cambia el precio
      if (body.precio) {
        product.precio = body.precio;
        res.json({ sucess: "ok", new: product });
      } //Cambia el nombre
      else if (body.nombre) {
        product.nombre = body.nombre;
        res.json({ sucess: "ok", new: product });
      } //Cambia la foto
      else if (body.foto) {
        product.foto = body.foto;
        res.json({ sucess: "ok", new: product });
      } //Cambia el id, timestamp, código...
      else if (body.id || body.timestamp || body.codigo) {
        res.json({ result: "no puede modificarse" });
      } else {
        res.json({ result: "error" });
      }
    } else {
      res.json({ error: "producto no encontrado" });
    }
  }
);

//Solo Admin
routerProducts.delete(
  "/:id",
  (req, res, next) => {
    //Verifico si es admin
    if (!administrador) {
      res.json({ error: "no posee autorización" });
      res.end();
    }
    next();
  },
  (req, res) => {
    const { id } = req.params;
    product = products.find((x) => x.id == id);
    if (product) {
      productsDelete = products.filter((x) => x.id != id);
      products = productsDelete;
      res.json({ sucess: "ok", new: products });
    } else {
      res.json({ error: "producto no encontrado" });
    }
  }
);

let carritos = [
  {
    id: 1,
    timestamp: 1662007058984,
    productos: [
      {
        id: 1,
        timestamp: 1662007056984,
        nombre: "remera",
        descripcion: "descripción del producto",
        codigo: "FYr3VGWDmyDnKKVVftG9",
        precio: 500,
        foto: "https://deliverind.com.ar/wp-content/uploads/2022/06/REMERA-REGULAR-FIT-SOFT-22-PORTADA-01-scaled.jpg",
        stock: 1,
      },
      {
        id: 3,
        timestamp: 1662007058284,
        nombre: "medias",
        descripcion: "descripción del producto",
        codigo: "62BPB72hk2jgGvM2ZM7r",
        precio: 200,
        foto: "https://deliverind.com.ar/wp-content/uploads/2021/09/4-10-scaled.jpg",
        stock: 2,
      },
    ],
  },
  {
    id: 2,
    timestamp: 1662107059984,
    productos: [
      {
        id: 2,
        timestamp: 1662007058984,
        nombre: "pantalon",
        descripcion: "descripción del producto",
        codigo: "wD2mPyXZW6R46nKgp9dJ",
        precio: 800,
        foto: "https://deliverind.com.ar/wp-content/uploads/2020/11/UNIDAD-71-scaled.jpg",
        stock: 1,
      },
      {
        id: 3,
        timestamp: 1662007058284,
        nombre: "medias",
        descripcion: "descripción del producto",
        codigo: "62BPB72hk2jgGvM2ZM7r",
        precio: 200,
        foto: "https://deliverind.com.ar/wp-content/uploads/2021/09/4-10-scaled.jpg",
        stock: 1,
      },
    ],
  },
];

routerCarrito.post("/", jsonParser, (req, res) => {
  const { body } = req;
  //Asigno ID
  let lastID = carritos[carritos.length - 1].id;
  body.id = lastID + 1;
  //
  //Asigno timestamp
  body.timestamp = Date.now();
  //
  //Los productos se supone que debería ingresarlos el cliente
  carritos.push(body);
  res.json({ sucess: "ok", new: body });
});

routerCarrito.get("/:id/productos", (req, res) => {
  const { id } = req.params;
  carrito = carritos.find((x) => x.id == id);
  if (carrito) {
    res.json(carrito.productos);
  } else {
    res.json({ error: "carrito no encontrado" });
  }
});

routerCarrito.delete("/:id", jsonParser, (req, res) => {
  const { id } = req.params;
  carrito = carritos.find((x) => x.id == id);
  if (carrito) {
    //Vacio el carrito
    carrito.productos = [];
    //Borro Carrito
    carritoBorrado = carritos.filter((x) => x.id != id);
    carritos = carritoBorrado;

    res.json({ sucess: "ok", new: carritos });
  } else {
    res.json({ error: "carrito no encontrado" });
  }
});

routerCarrito.post("/:id/productos", jsonParser, (req, res) => {
  const { body } = req;
  const { id } = req.params;
  const carrito = carritos.find((x) => x.id == id);
  if (carrito) {
    productoAgregado = carrito.productos.find((x) => x.id == body.id);
    if (productoAgregado) {
      //Si el producto ya estaba agregado al carrito modificamos su cantidad
      productoAgregado.stock = productoAgregado.stock + body.stock;
      res.json({ sucess: "ok", new: carrito });
    } else {
      //Si el producto no estaba en el carrito vamos agregarlo
      carrito.productos.push(body);
      res.json({ sucess: "ok", new: carrito });
    }
  } else {
    res.json({ error: "carrito no encontrado" });
  }
});

routerCarrito.delete("/:id/productos/:id_prod", jsonParser, (req, res) => {
  const { id } = req.params;
  const { id_prod } = req.params;
  const carrito = carritos.find((x) => x.id == id);
  if (carrito) {
    productoEliminado = carrito.productos.find((x) => x.id == id_prod);
    if (productoEliminado) {
      carritoSinProductoEliminado = carrito.productos.filter(
        (x) => x.id != id_prod
      );
      carrito.productos = carritoSinProductoEliminado;
      res.json({ sucess: "ok", new: carrito });
    } else {
      res.json({ error: "producto no encontrado en el carrito" });
    }
  } else {
    res.json({ error: "carrito no encontrado" });
  }
});

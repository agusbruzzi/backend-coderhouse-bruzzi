const fs = require("fs");
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

const server = app.listen(process.env.PORT || 8080, () => {
  console.log("Servidor encendido");
});

function read(archivo) {
  try {
    return (contenido = JSON.parse(fs.readFileSync(archivo, "utf-8")));
  } catch (error) {
    console.log("Error en lectura. Detalle del error: ", error);
  }
}

function write(archivo, contenido) {
  try {
    return (contenido = fs.writeFileSync(archivo, JSON.stringify(contenido)));
  } catch (error) {
    console.log("Error en escritura. Detalle del error: ", error);
  }
}

routerProducts.get("/", (req, res) => {
  const products = read("./productos.json");
  res.json(products);
});

routerProducts.get("/:id", (req, res) => {
  const { id } = req.params;
  const products = read("./productos.json");
  const product = products.find((x) => x.id == id);
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
    const products = read("./productos.json");
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
    write("./productos.json", products);
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
    const products = read("./productos.json");
    const product = products.find((x) => x.id == id);
    if (product) {
      //Cambia el precio
      if (body.precio) {
        product.precio = body.precio;
        write("./productos.json", products);
        res.json({ sucess: "ok", new: product });
      } //Cambia el nombre
      else if (body.nombre) {
        product.nombre = body.nombre;
        write("./productos.json", products);
        res.json({ sucess: "ok", new: product });
      } //Cambia la foto
      else if (body.foto) {
        product.foto = body.foto;
        write("./productos.json", products);
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
    let products = read("./productos.json");
    const product = products.find((x) => x.id == id);
    if (product) {
      productsDelete = products.filter((x) => x.id != id);
      products = productsDelete;
      write("./productos.json", products);
      res.json({ sucess: "ok", new: products });
    } else {
      res.json({ error: "producto no encontrado" });
    }
  }
);

routerCarrito.post("/", jsonParser, (req, res) => {
  const { body } = req;
  const carritos = read("./carrito.json");
  //Asigno ID
  let lastID = carritos[carritos.length - 1].id;
  body.id = lastID + 1;
  //
  //Asigno timestamp
  body.timestamp = Date.now();
  //
  //Los productos se supone que debería ingresarlos el cliente
  carritos.push(body);
  write("./carrito.json", carritos);
  res.json({ sucess: "ok", new: body.id });
});

routerCarrito.get("/:id/productos", (req, res) => {
  const { id } = req.params;
  const carritos = read("./carrito.json");
  const carrito = carritos.find((x) => x.id == id);
  if (carrito) {
    res.json(carrito.productos);
  } else {
    res.json({ error: "carrito no encontrado" });
  }
});

routerCarrito.delete("/:id", jsonParser, (req, res) => {
  const { id } = req.params;
  let carritos = read("./carrito.json");
  const carrito = carritos.find((x) => x.id == id);
  if (carrito) {
    //Vacio el carrito
    carrito.productos = [];
    //Borro Carrito
    carritoBorrado = carritos.filter((x) => x.id != id);
    carritos = carritoBorrado;
    write("./carrito.json", carritos);
    res.json({ sucess: "ok", new: carritos });
  } else {
    res.json({ error: "carrito no encontrado" });
  }
});

routerCarrito.post("/:id/productos", jsonParser, (req, res) => {
  const { body } = req;
  const { id } = req.params;
  const carritos = read("./carrito.json");
  const carrito = carritos.find((x) => x.id == id);
  if (carrito) {
    productoAgregado = carrito.productos.find((x) => x.id == body.id);
    if (productoAgregado) {
      //Si el producto ya estaba agregado al carrito modificamos su cantidad
      productoAgregado.stock = productoAgregado.stock + body.stock;
      write("./carrito.json", carritos);
      res.json({ sucess: "ok", new: carrito });
    } else {
      //Si el producto no estaba en el carrito vamos agregarlo
      carrito.productos.push(body);
      write("./carrito.json", carritos);
      res.json({ sucess: "ok", new: carrito });
    }
  } else {
    res.json({ error: "carrito no encontrado" });
  }
});

routerCarrito.delete("/:id/productos/:id_prod", jsonParser, (req, res) => {
  const { id } = req.params;
  const { id_prod } = req.params;
  const carritos = read("./carrito.json");
  const carrito = carritos.find((x) => x.id == id);
  if (carrito) {
    productoEliminado = carrito.productos.find((x) => x.id == id_prod);
    if (productoEliminado) {
      carritoSinProductoEliminado = carrito.productos.filter(
        (x) => x.id != id_prod
      );
      carrito.productos = carritoSinProductoEliminado;
      write("./carrito.json", carritos);
      res.json({ sucess: "ok", new: carrito });
    } else {
      res.json({ error: "producto no encontrado en el carrito" });
    }
  } else {
    res.json({ error: "carrito no encontrado" });
  }
});

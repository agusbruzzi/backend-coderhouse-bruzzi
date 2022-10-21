const express = require('express');
const app = express();
const httpServer = require('http').createServer(app);

const Producto = require('./bd/productos');
const Productos = new Producto();

const MongoStore = require('connect-mongo');

const session = require('express-session');
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: 'mongodb+srv://agusbruzzi:agusbruzzi123@cluster0.kkhuuwt.mongodb.net/?retryWrites=true&w=majority',
      mongoOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    }),
    secret: 'secreto?',
    resave: true,
    saveUninitialized: false,
    rolling: true,
    cookie: {
      maxAge: 60000,
    },
  })
);

app.use('/public', express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

httpServer.listen(process.env.PORT || 8080, () => console.log('SERVER ON'));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('pages/iniciar-sesion');
});

app.get('/iniciar-sesion', (req, res) => {
  res.render('pages/iniciar-sesion');
});

app.post('/products', async function (req, res) {
  const { body } = req;
  req.session.usuario = body.nombre;
  req.session.admin = true;
  console.log('se creo la sesion de:', body.nombre);
  res.render('pages/products', { nombre: body.nombre });
});

app.get('/products', (req, res) => {
  if (req.session.usuario) {
    res.render('pages/products', { nombre: req.session.usuario });
  } else {
    res.render('pages/iniciar-sesion');
  }
});

app.post('/cerrar-sesion', (req, res) => {
  const nombre = req.session.usuario;
  req.session.destroy();
  console.log('se borro la sesion de:', nombre);
  res.render('pages/cerrar-sesion', { nombre: nombre });
});

app.get('/products-list', async function (req, res) {
  try {
    const products = await Productos.mostrarProductos();
    res.render('pages/productslist', { title: 'listado de productos', products: products });
  } catch (error) {
    res.status(500).send({
      status: 500,
      message: error.message,
    });
  }
});

app.post('/products-list', async function (req, res) {
  const { body } = req;
  const newProduct = { nombre: body.title, precio: body.price, foto: body.imagen };
  try {
    const productoNuevo = await Productos.nuevoProducto(newProduct);
    const products = await Productos.mostrarProductos();
    res.render('pages/productslist', { title: 'listado de productos', products: products });
  } catch (error) {
    res.status(500).send({
      status: 500,
      message: error.message,
    });
  }
});

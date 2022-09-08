const Contenedor = require('./data/data_metods/knex-data');
const ContenedorSQLite3 = require('./data/data_metods/sqlite3-db');

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const urlcodedParser = bodyParser.urlencoded({ extended: false });

const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer);

httpServer.listen(process.env.PORT || 8080, () => console.log('SERVER ON'));

app.use('/public', express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('pages/index'); //, { products: products, productsExist: true }
});

io.on('connection', (socket) => {
  const data_products = new Contenedor('products');
  const data_chat = new ContenedorSQLite3();

  (async function () {
    const chat = await data_chat.mostrarMensajes();
    io.sockets.emit('arr-chat', chat);
  })();
  (async function () {
    const productos = await data_products.mostrarProductos();
    io.sockets.emit('arr-products', productos);
  })();

  socket.on('data-generica', (data) => {
    const mensaje = {
      name: data.name,
      msg: data.msg,
      date: data.date,
    };
    data_chat.insertMsg(mensaje);
    (async function () {
      const chat = await data_chat.mostrarMensajes();
      io.sockets.emit('arr-chat', chat);
    })();
  });

  socket.on('data-products', (data) => {
    const caracteres = 'abcdefghijkmnpqrtuvwxyzABCDEFGHJKMNPQRTUVWXYZ2346789';
    let codigo = '';
    for (i = 0; i < 20; i++) codigo += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    data.code = codigo;
    data.timestamp = Date.now();
    const product = {
      product_name: data.name,
      product_code: data.code,
      product_price: data.price,
      product_img: data.img,
      product_stock: data.stock,
      product_timestamp: data.timestamp,
      product_description: data.description,
    };
    data_products.insertProduct(product);
    (async function () {
      const productos = await data_products.mostrarProductos();
      io.sockets.emit('arr-products', productos);
    })();
  });
});

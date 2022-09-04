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

let chat = [];

const products = [
  {
    id: 1,
    title: 'remera',
    price: 500,
    thumbnail: 'https://deliverind.com.ar/wp-content/uploads/2022/06/REMERA-REGULAR-FIT-SOFT-22-PORTADA-01-scaled.jpg',
  },
  {
    id: 2,
    title: 'pantalon',
    price: 900,
    thumbnail: 'https://deliverind.com.ar/wp-content/uploads/2020/11/UNIDAD-71-scaled.jpg',
  },
  {
    id: 3,
    title: 'medias',
    price: 200,
    thumbnail: 'https://deliverind.com.ar/wp-content/uploads/2021/09/4-10-scaled.jpg',
  },
];

app.get('/', (req, res) => {
  res.render('pages/index', { products: products, productsExist: true });
});

io.on('connection', (socket) => {
  io.sockets.emit('arr-chat', chat);
  io.sockets.emit('arr-products', products);

  socket.on('data-generica', (data) => {
    chat.push(data);
    io.sockets.emit('arr-chat', chat);
  });
  socket.on('data-products', (data) => {
    let lastID = products[products.length - 1].id;
    data.id = lastID + 1;
    const newProduct = { id: data.id, title: data.title, price: data.price, thumbnail: data.thumbnail };
    products.push(newProduct);
    io.sockets.emit('arr-products', products);
  });
});

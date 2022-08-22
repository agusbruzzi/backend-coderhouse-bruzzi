const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const { engine } = require('express-handlebars');
const PORT = 8080;
const urlcodedParser = bodyParser.urlencoded({ extended: false });

const server = app.listen(PORT, () => {
  console.log(`Servidor http escuchando en el puerto ${server.address().port}`);
});

server.on('error', (error) => console.log(`Error en servidor ${error}`));
app.use('/public', express.static(__dirname + '/public'));

app.set('view engine', 'hbs');
app.set('views', './views');
app.engine(
  'hbs',
  engine({
    extname: '.hbs',
    defaultLayout: 'index.hbs',
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials',
  })
);

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
  res.render('productsnew', { products: products, productsExist: true });
});

app.get('/products', (req, res) => {
  if (products.length != 0) {
    res.render('productslist', { products: products, productsExist: true });
  } else {
    res.render('noneproductos');
  }
});

app.post('/products', urlcodedParser, (req, res) => {
  const { body } = req;
  let lastID = products[products.length - 1].id;
  body.id = lastID + 1;
  const newProduct = { id: body.id, title: body.title, price: body.price, thumbnail: body.imagen };
  console.log(newProduct);
  products.push(newProduct);
  res.render('productsnew', { products: products, productsExist: true });
});

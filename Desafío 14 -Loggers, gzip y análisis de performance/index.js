const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const session = require('express-session');
const app = express();
const httpServer = require('http').createServer(app);
//////////////////////////////////////////////////////////////////// VARIABLES DE ENTORNO ////////////////////////////////////////////////////////////////////
const config = require('./config');
//////////////////////////////////////////////////////////////////// TRAIGO PRODUCTOS Y USUARIOS ////////////////////////////////////////////////////////////////////
const Producto = require('./bd/productos');
const Productos = new Producto();
const Usuarios = require('./bd/models/schemaUsuarios');
///////////////////////////////////////////////////////////////////////// CONEXION A MONGODB /////////////////////////////////////////////////////////////////////////
mongoose
  .connect(config.BD)
  .then(() => console.log('Connected to DB'))
  .catch((e) => {
    console.error(e);
    throw 'can not connect to the db';
  });
///////////////////////////////////////////////////////////////////////// ENCRIPTADO PASSWORD /////////////////////////////////////////////////////////////////////////
function isValidPassword(user, password) {
  return bcrypt.compareSync(password, user.password);
}
function createHash(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
}
////////////////////////////////////////////////////////////////////// ESTRATEGIAS LOGIN / SING UP //////////////////////////////////////////////////////////////////////
passport.use(
  'login',
  new LocalStrategy((username, password, done) => {
    Usuarios.findOne({ username }, (err, user) => {
      if (err) return done(err);
      if (!user) {
        console.log('No se encontro el usuario:' + username);
        return done(null, false);
      }
      if (!isValidPassword(user, password)) {
        console.log('Contraseña Invalida');
        return done(null, false);
      }
      return done(null, user);
    });
  })
);
passport.use(
  'signup',
  new LocalStrategy(
    {
      passReqToCallback: true,
    },
    (req, username, password, done) => {
      Usuarios.findOne({ username: username }, function (err, user) {
        if (err) {
          return done(err);
        }
        if (user) {
          console.log('El usuario ya existe');
          return done(null, false);
        }
        const newUser = {
          username: username,
          password: createHash(password),
        };
        Usuarios.create(newUser, (err, userWithId) => {
          if (err) {
            console.log('Error en registrar usuario: ' + err);
            return done(err);
          }
          console.log('Usuario registrado con exito', user);
          return done(null, userWithId);
        });
      });
    }
  )
);
//////////////////////////////////////////////////////////////////// SERIALIZAR Y DESERIALIZAR ////////////////////////////////////////////////////////////////////
passport.serializeUser((user, done) => {
  done(null, user._id);
});
passport.deserializeUser((id, done) => {
  Usuarios.findById(id, done);
});
//////////////////////////////////////////////////////////////////// CONFIGURACION SESSION ////////////////////////////////////////////////////////////////////
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: config.BD,
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
//////////////////////////////////////////////////////////////////// LEVANTO SERVER COMO SIEMPRE ////////////////////////////////////////////////////////////////////
app.use(passport.initialize());
app.use(passport.session());
//////////////////////COMPRESION//////////////////////////
const compression = require('compression');
app.use(compression());
//////////////////////////////////////////////////////////
app.use('/public', express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const cluster = require('cluster');
const CPUs = require('os').cpus().length;

if (config.MODO === 'cluster') {
  if (cluster.isMaster) {
    console.log(`Numero de procesadores: ${CPUs}`);
    console.log(`PID master: ${process.pid}`);
    for (let i = 0; i < CPUs; i++) {
      cluster.fork();
    }
    cluster.on('exit', (worker, code, signal) => {
      cluster.fork();
      console.log(`worker ${worker.process.pid} died`);
    });
  } else {
    httpServer.listen(process.env.PORT || config.PUERTO, () => console.log('SERVER ON', config.PUERTO));
    console.log(`Worker ${process.pid} started`);
  }
} else {
  httpServer.listen(process.env.PORT || config.PUERTO, () => console.log('SERVER ON', config.PUERTO));
}

app.set('view engine', 'ejs');

const winston = require('winston');

const logger = winston.createLogger({
  transports: [
    new winston.transports.File({ filename: 'err.log', level: 'error' }),
    new winston.transports.File({ filename: 'warn.log', level: 'warn' }),
    new winston.transports.Console({ level: 'verbose' }),
  ],
});
logger.info('Mensaje informativo');
logger.warn('Mensaje de advertencia');
logger.error('Mensaje de error');
///////////////////////////////////////////////////////////// GET DE PAGINAS DE REGISTRO Y LOGIN /////////////////////////////////////////////////////////////
app.get('/', (req, res) => {
  res.render('pages/login-registro/login');
  logger.info('/');
});
app.get('/iniciar-sesion', (req, res) => {
  res.render('pages/login-registro/login');
  logger.info('/iniciar-sesion');
});
app.get('/registrar', (req, res) => {
  res.render('pages/login-registro/register');
  logger.info('/registrar');
});
///////////////////////////////////////////////////////////////////// REGISTRO DE USUARIO ///////////////////////////////////////////////////////////////////
app.post('/registrar-usuario', passport.authenticate('signup', { failureRedirect: '/error-registro' }), (req, res) => {
  const { username, password } = req.user;
  const user = { username, password };
  res.redirect('/iniciar-sesion');
});
app.get('/error-registro', (req, res) => {
  res.render('pages/error-login-registro/register-error');
});
/////////////////////////////////////////////////////////////////////// INICIO DE SESION /////////////////////////////////////////////////////////////////////
app.post('/iniciar-sesion', passport.authenticate('login', { failureRedirect: '/error-inicio-sesion' }), (req, res) => {
  const { username, password } = req.user;
  const user = { username, password };
  req.session.username = user.username;
  req.session.password = user.password;
  req.session.admin = true;
  res.redirect('/productos');
});
app.get('/error-inicio-sesion', (req, res) => {
  res.render('pages/error-login-registro/login-error');
});
/////////////////////////////////////////////////////////////////////// CERRAR DE SESION /////////////////////////////////////////////////////////////////////
app.get('/cerrar-sesion', (req, res) => {
  req.session.destroy();
  req.logout();
  res.render('pages/login-registro/logout');
});
/////////////////////////////////////////////////////////////////////MANEJO DE PRODUCTOS/////////////////////////////////////////////////////////////////////
function checkAuthentication(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect('/');
  }
}
app.get('/productos', checkAuthentication, (req, res) => {
  const { username, password } = req.user;
  const user = { username, password };
  res.render('pages/productos/products', { nombre: user.username });
});
app.get('/products-list', checkAuthentication, async function (req, res) {
  const { username, password } = req.user;
  const user = { username, password };
  try {
    const products = await Productos.mostrarProductos();
    res.render('pages/productos/productslist', { title: 'listado de productos', products: products });
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
    res.render('pages/productos/productslist', { title: 'listado de productos', products: products });
  } catch (error) {
    res.status(500).send({
      status: 500,
      message: error.message,
    });
  }
});
/////////////////////////////////////////////////////////////////////RUTA INFO/////////////////////////////////////////////////////////////////////
app.get('/info', (req, res) => {
  const argEntrada = process.argv;
  const plataforma = process.title;
  const versionNode = process.version;
  const memoriaTotal = process.memoryUsage().rss;
  const pathEjecucion = process.execPath;
  const processId = process.pid;
  const carpetaProyecto = process.cwd();
  const procesadoresNum = require('os').cpus().length;
  res.render('pages/info/info', {
    argumentos: argEntrada,
    plataforma: plataforma,
    versionNode: versionNode,
    memoriaTotal: memoriaTotal,
    pathEjecucion: pathEjecucion,
    processId: processId,
    carpetaProyecto: carpetaProyecto,
    procesadoresNum: procesadoresNum,
  });
});

/////////////////////////////////////////////////////////////////////RANDOMS/////////////////////////////////////////////////////////////////////
const { fork } = require('child_process');
app.get('/randoms', checkAuthentication, (req, res) => {
  res.render('pages/randoms/random', { resultado: 0 });
});
app.post('/randoms', checkAuthentication, (req, res) => {
  const { body } = req;
  const cantidad = body.cantidad;
  if (cantidad) {
    let calculo = fork('./random.js');
    calculo.send('start');
    calculo.on('message', (msg) => {
      const { data, type } = msg;
      switch (type) {
        case 'claves':
          res.end(res.render('pages/randoms/random', { resultado: data }));
          break;
      }
    });
  } else {
    let calculo = fork('./random.js');
    calculo.send('start');
    calculo.on('message', (msg) => {
      const { data, type } = msg;
      switch (type) {
        case 'claves':
          res.end(res.render('pages/randoms/random', { resultado: data }));
          break;
      }
    });
  }
});

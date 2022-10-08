const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const { normalizarChat, desnormalizarChat } = require('./normalizr/normalizarMensajes.js');
const urlcodedParser = bodyParser.urlencoded({ extended: false });

const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer);

httpServer.listen(process.env.PORT || 8080, () => console.log('SERVER ON'));

app.use('/public', express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('pages/index');
});

io.on('connection', (socket) => {
  //Actualizar chat en el front
  let chat = read('./mensajes.json');
  let chatNormalizado = normalizarChat(chat);
  io.sockets.emit('arr-chat', chatNormalizado);

  socket.on('data-generica', (data) => {
    //Agregar info al archivo de chat
    let chat = read('./mensajes.json');
    chat.push(data);
    write('./mensajes.json', chat);

    //Actualizar chat en el front
    let chatNormalizado = normalizarChat(chat);
    io.sockets.emit('arr-chat', chatNormalizado);
  });
});

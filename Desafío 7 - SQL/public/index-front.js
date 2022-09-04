const socket = io();

socket.on('connect', () => {});

socket.on('data-generica', (data) => {});

socket.on('arr-chat', (data) => {
  const html = data.reduce(
    (html, item) => '<div>' + '<p class="name-chat chat">' + item.name + '<p class="date-chat chat">' + item.date + '<p class="msg-chat chat">' + item.msg + '</p></div>' + html,
    ''
  );
  document.getElementById('div-chat').innerHTML = html;
});

function sendMsg() {
  const name = document.getElementById('box-name').value;
  const msg = document.getElementById('box-msg').value;
  var today = new Date();
  const now = ' [' + today.toLocaleString() + '] : ';
  socket.emit('data-generica', { name: name, msg: msg, date: now });
}

socket.on('data-products', (data) => {});

socket.on('arr-products', (data) => {
  const html = data.reduce((html, item) => '<div>' + '<p> ID producto: ' + item.id + '</p><p>Nombre producto: ' + item.title + '</p><p> Precio producto: ' + item.price + '</p></div>' + html, '');
  document.getElementById('div-products').innerHTML = html;
});

function sendProd() {
  const name = document.getElementById('name-product').value;
  const price = document.getElementById('price-product').value;
  const img = document.getElementById('img-product').value;
  socket.emit('data-products', { title: name, price: price, thumbnail: img });
}

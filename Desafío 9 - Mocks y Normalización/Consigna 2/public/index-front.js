const socket = io();

socket.on('connect', () => {});

socket.on('data-generica', (data) => {});

socket.on('arr-chat', (data) => {
  const html = data.reduce(
    (html, item) => '<div>' + '<p class="name-chat chat">' + item.nombre + '<p class="date-chat chat">' + item.date + '<p class="msg-chat chat">' + item.mensaje + '</p></div>' + html,
    ''
  );
  document.getElementById('div-chat').innerHTML = html;
});

function sendMsg() {
  console.log('dale');
  const message = {
    author: {
      id: document.getElementById('box-casilla').value,
      nombre: document.getElementById('box-nombre').value,
      apellido: document.getElementById('box-apellido').value,
      edad: document.getElementById('box-edad').value,
      alias: document.getElementById('box-alias').value,
      avatar: document.getElementById('box-avatar').value,
    },
    text: document.getElementById('box-mensaje').value,
  };
  socket.emit('data-generica', JSON.stringify(message));
}

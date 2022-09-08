const knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: '../DB/mydb.sqlite',
  },
  useNullAsDefault: true,
});

class ContenedorSQLite3 {
  constructor() {
    this.tabla = 'chat';
  }
  insertMsg(msg) {
    knex('chat')
      .insert(msg)
      .then(() => console.log('data inserted'))
      .catch((err) => {
        console.log(err);
        throw err;
      });
  }
  async selectMsg() {
    try {
      return (messages = await knex('chat'));
    } catch (error) {
      console.log(' LPM Error en lectura. Detalle del error: ', error);
    }
  }
  async mostrarMensajes() {
    const mensajes = await this.selectMsg();
    return mensajes;
  }
}

module.exports = ContenedorSQLite3;

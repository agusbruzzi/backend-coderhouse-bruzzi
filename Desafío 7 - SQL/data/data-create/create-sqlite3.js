const knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: '../DB/mydb.sqlite',
  },
  useNullAsDefault: true,
});

knex.schema
  .createTable('chat', (table) => {
    table.increments('id'), table.string('name'), table.string('msg'), table.string('date');
  })
  .then(() => {
    console.log('creada');
  })
  .catch((err) => {
    console.log(err);
    throw new Error(err);
  })
  .finally(() => {
    knex.destroy();
  });

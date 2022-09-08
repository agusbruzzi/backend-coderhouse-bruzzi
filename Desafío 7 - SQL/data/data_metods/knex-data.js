const { options } = require('./optionsMDB');
const knex = require('knex')(options);

class Contenedor {
  constructor(tabla) {
    this.tabla = tabla;
  }
  insertProduct(productNew) {
    knex(this.tabla)
      .insert(productNew)
      .then(() => console.log('data inserted'))
      .catch((err) => {
        console.log(err);
        throw err;
      });
  }
  async selectProduct() {
    let products = [];
    try {
      await knex
        .from(this.tabla)
        .select('*')
        .then((rows) => {
          for (let row of rows) {
            products.push(row);
          }
        })
        .catch((err) => {
          console.log(err);
          throw err;
        });

      return products;
    } catch (error) {
      console.log('Error en lectura. Detalle del error: ', error);
    }
  }
  async mostrarProductos() {
    const productos = await this.selectProduct();
    return productos;
  }
}

module.exports = Contenedor;

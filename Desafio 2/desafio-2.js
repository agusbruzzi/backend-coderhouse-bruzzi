const fs = require("fs");

class Contenedor {
  constructor(name) {
    this.nombreArchivo = name;
  }

  async read() {
    try {
      return JSON.parse(
        await fs.promises.readFile(this.nombreArchivo, "utf-8")
      );
    } catch (error) {
      console.log("Error en lectura. Detalle del error: ", error);
    }
  }

  async save(nuevoProducto) {
    const productos = await this.read();
    let ultimoID = productos[productos.length - 1].id;
    nuevoProducto.id = ultimoID + 1;
    productos.push(nuevoProducto);

    try {
      await fs.promises.writeFile(
        this.nombreArchivo,
        JSON.stringify(productos)
      );
      console.log(
        "Se añadió correctamente el producto, su número de ID es: ",
        nuevoProducto.id
      );
    } catch (error) {
      console.log("Error en escritura. Detalle del error: ", error);
    }
  }

  async getById(idBuscado) {
    const productos = await this.read();
    const productoEncontrado = productos.find((x) => x.id === idBuscado);
    if (productoEncontrado) {
      console.log(productoEncontrado);
    } else {
      console.log(null);
    }
  }

  async getAll() {
    const productos = await this.read();
    console.log(productos);
  }

  async deleteById(idBuscado) {
    const productos = await this.read();
    const productoEncontrado = productos.find((x) => x.id === idBuscado);
    //Iba hacer un splice pero me di cuenta que al borrar elementos del medio los ID dejarian de estar ordenados
    //alfabeticamente, se me ocurrio cambiar el valor del ID para que deje de ser numerico
    //y al ordenarlo con sort() quede al final, eliminando el objeto con pop()
    if (productoEncontrado) {
      productoEncontrado.id = 0;
      productos.sort(function (a, b) {
        if (a.id > b.id) {
          return 1;
        }
        if (a.id < b.id) {
          return -1;
        }
        return 0;
      });
      productos.shift();
      try {
        await fs.promises.writeFile(
          this.nombreArchivo,
          JSON.stringify(productos)
        );
      } catch (error) {
        console.log("Error en borrado. Detalle del error: ", error);
      }
    } else {
      console.log("No se encuentra el ID ingresado.");
    }
  }

  async deleteAll() {
    let productos = await this.read();
    productos = [];
    try {
      await fs.promises.writeFile(
        this.nombreArchivo,
        JSON.stringify(productos)
      );
    } catch (error) {
      console.log("Error en borrado. Detalle del error: ", error);
    }
  }
}

const archivo = new Contenedor("./productos.json");
archivo.save({
  title: "Paleta",
  price: 126.85,
  thumbnail:
    "https://cdn3.iconfinder.com/data/icons/education-209/64/paint-color-pallete-brush-academy-512.png",
});
//archivo.getById(2);
//archivo.getAll();
//archivo.deleteById(2);
//archivo.deleteAll();

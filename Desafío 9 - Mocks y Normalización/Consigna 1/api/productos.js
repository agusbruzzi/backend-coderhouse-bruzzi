import ContenedorMemoria from "../contenedores/ContenedorMemoria.js";
import { generarProductos } from "../utils/generadorProductos.js";

class ApiProductosMock extends ContenedorMemoria {
  constructor() {
    super();
  }

  generar(cant = 5) {
    const nuevos = [];
    for (let i = 0; i < cant; i++) {
      const nuevoProducto = generarProductos();
      console.log(nuevoProducto);
      const guardado = this.guardar(nuevoProducto);
      nuevos.push(guardado);
    }
    return nuevos;
  }
}

export default ApiProductosMock;

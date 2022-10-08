import { generarUsuario } from "../utils/generadorDeUsuarios.js";
import { generarId } from "../utils/generadorDeIds.js";

class ContenedorMemoria {
  constructor() {
    this.items = [];
  }
  guardar(nuevoUsuario) {
    this.items.push(nuevoUsuario);
  }
}

export default ContenedorMemoria;

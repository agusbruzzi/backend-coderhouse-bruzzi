class ContenedorMemoria {
  constructor() {
    this.items = [];
  }
  guardar(nuevoProducto) {
    this.items.push(nuevoProducto);
  }
}

export default ContenedorMemoria;

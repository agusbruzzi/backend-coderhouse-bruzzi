class Usuario {
  constructor(nombre, apellido, libros, mascotas) {
    this.nombre = nombre;
    this.apellido = apellido;
    this.libros = libros;
    this.mascotas = mascotas;
  }
  getFullName() {
    console.log(`Nombre completo: ${this.nombre} ${this.apellido}`);
  }
  addMascotas(nuevaMascota) {
    this.mascotas.push(nuevaMascota);
  }
  countMascotas() {
    console.log("El usuario posee: " + this.mascotas.length + " mascotas.");
  }
  addBook(nombreLibro, nombreAutor) {
    let nuevoLibro = { nombre: nombreLibro, autor: nombreAutor };
    this.libros.push(nuevoLibro);
  }
  getBookNames() {
    console.log("El usuario posee los siguientes libros: ");
    let nombreLibros = [];
    this.libros.forEach((e) => {
      nombreLibros.push(e.nombre);
    });
    console.log(nombreLibros);
  }
}

const nuevoUsuario = new Usuario(
  "Milagros",
  "Maldonado",
  [{ nombre: "Orgullo y prejuicio", autor: "Jane Austen" }],
  ["Lana"]
);

nuevoUsuario.getFullName();
nuevoUsuario.addMascotas("Olivia");
nuevoUsuario.countMascotas();
nuevoUsuario.addBook("Romeo y Julieta", "Shakespeare");
nuevoUsuario.getBookNames();

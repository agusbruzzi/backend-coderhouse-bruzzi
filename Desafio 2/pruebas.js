const fs = require("fs");

async function leerArchivo() {
  try {
    const contenidoArchivo = await fs.promises.readFile(
      "./productos.json",
      "utf-8"
    );
    const arrayArchivo = JSON.parse(contenidoArchivo);
    console.log(arrayArchivo);
  } catch (error) {
    console.log("Error en lectura. Detalle del error: ", error);
  }
}
leerArchivo();

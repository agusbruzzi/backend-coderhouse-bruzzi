import { faker } from "@faker-js/faker";
faker.locale = "es";

function generarProductos() {
  console.log("se genero!");
  return {
    id: faker.database.mongodbObjectId(),
    name: faker.vehicle.vehicle(),
    price: faker.commerce.price(5000, 20000, 0, "$"),
    thumbnail: faker.image.avatar(),
  };
}

export { generarProductos };

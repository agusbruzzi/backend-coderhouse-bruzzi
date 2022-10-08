import { faker } from "@faker-js/faker";
faker.locale = "es";

function generarId() {
  return faker.datatype.uuid();
}

export { generarId };

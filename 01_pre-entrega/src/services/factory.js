import config from "../config/config.js";
import MongoSingleton from "../config/mongodb-singleton.js";

let productsService
let cartsService

async function initializeMongoService() {
  console.log("Iniciando servicio para MongoDB");
  try {
    // conectamos Mongo
    await MongoSingleton.getInstance()

    // Creamos las instancias de las Clases de DAO de Mongo
    const { default: ProductsServiceMongo } = await import('./dao/db/services/productService.js');
    productsService = new ProductsServiceMongo();
    console.log("Servicio de products cargado:");
    console.log(productsService);

    const { default: CartsServiceMongo } = await import('./dao/db/services/cartsService.js');
    cartsService = new CartsServiceMongo();
    console.log("Servicio de carts cargado:");
    console.log(cartsService);


} catch (error) {
    console.error("Error al iniciar MongoDB:", error);
    process.exit(1); // Salir con código de error
}
}

console.log(config.persistence);
switch (config.persistence) {
  case "mongodb":
    initializeMongoService();
    break;
  case "files":
    const { default: ProductServiceFileSystem } = await import("./dao/fileSystem/models/ProductManager.js");
    productsService = new ProductServiceFileSystem();
    console.log("Servicio de courses cargado: ", productsService);

    const { default: CartsServiceFileSystem } = await import("./dao/fileSystem/models/Carrito.js");
    cartsService = new CartsServiceFileSystem();
    console.log("Servicio de carts cargado: ", cartsService);

    break;

  default:
    console.error("Persistenciaa no válida en la configuración: ",config.persistence);
    process.exit(1);
}

export { productsService, cartsService };

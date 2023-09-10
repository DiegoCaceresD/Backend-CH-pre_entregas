import express from "express";
import productsRoutes from './routes/products.routes.js'
import cartsRoutes from './routes/carts.routes.js'
import mongoose from "mongoose";
import __dirname from "./utils.js";

const app = express();
const PORT = 8080;

//Preparo al servidor para que pueda trabajar con archivos JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/public'))

app.use('/api/products', productsRoutes)
app.use('/api/carts', cartsRoutes)

app.listen(PORT, () => {
  console.log(`Server run on port: ${PORT}`);
});

//conexion con DB

const DB = 'mongodb+srv://dcaceres2097:di5sL8gQZrSmgA0s@cluster0.77np4wo.mongodb.net/proyecto?retryWrites=true&w=majority'

const connectMongoDb = async()=>{
  try {
    await mongoose.connect(DB)
    console.log("conectado a la base usando mongoose");
  } catch (error) {
    console.log("no se pudo conectar a la base de datos");
  }
}
connectMongoDb();
import express from "express";
import productsRoutes from './routes/products.routes.js'
import cartsRoutes from './routes/carts.routes.js'

const app = express();
const PORT = 8080;

//Preparo al servidor para que pueda trabajar con archivos JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/products', productsRoutes)
app.use('/api/carts', cartsRoutes)

app.listen(PORT, () => {
  console.log(`Server run on port: ${PORT}`);
});
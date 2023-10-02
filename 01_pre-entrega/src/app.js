import express from "express";
import productsRoutes from './routes/products.routes.js'
import cartsRoutes from './routes/carts.routes.js'
import usersViewRouter from './routes/users.views.router.js';
import sessionsRouter from './routes/sessions.router.js'
import viewsRoutes from './routes/views.router.js'
import mongoose from "mongoose";
import __dirname from "./utils.js";
import handlebars from 'express-handlebars';
import session from 'express-session';
import MongoStore from "connect-mongo";
import passport from 'passport';
import initializePassport from './config/passport.config.js';

const app = express();
const PORT = 8080;
const DB = 'mongodb+srv://dcaceres2097:di5sL8gQZrSmgA0s@cluster0.77np4wo.mongodb.net/proyecto?retryWrites=true&w=majority'

//Preparo al servidor para que pueda trabajar con archivos JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/db/js'))


//views
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + '/public'));

//session
app.use(session({
  store: MongoStore.create({
    mongoUrl: DB,
    // mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
    ttl:10
  }),
  secret: "coderS3cret",
  resave: false,
  saveUninitialized: true,
}))

//middlewares
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

//Routes
app.use('/api/products', productsRoutes);
app.use('/api/carts', cartsRoutes);
app.use("/users", usersViewRouter);
app.use("/api/sessions", sessionsRouter);
app.use('/', viewsRoutes);

app.listen(PORT, () => {
  console.log(`Server run on port: ${PORT}`);
});

//conexion con DB
const connectMongoDb = async()=>{
  try {
    await mongoose.connect(DB)
    console.log("conectado a la base usando mongoose");
  } catch (error) {
    console.log("no se pudo conectar a la base de datos");
  }
}
connectMongoDb();
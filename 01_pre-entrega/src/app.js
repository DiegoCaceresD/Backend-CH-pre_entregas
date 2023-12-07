import express from "express";
import cartsRoutes from './routes/carts.router.js';
import usersViewRouter from './routes/users.views.router.js';
import viewsRoutes from './routes/views.router.js';
import githubLoginViewRouter from './routes/github-login.views.router.js';
import __dirname from "./utils.js";
import handlebars from 'express-handlebars';
import session from 'express-session';
import MongoStore from "connect-mongo";
import passport from 'passport';
import initializePassport from './config/passport.config.js';
import cookieParser from "cookie-parser";
import SessionRouter from "./routes/sessions.router.js";
import config from "./config/config.js";
import cors from 'cors';
import MongoSingleton from "./config/mongodb-singleton.js";
import emailRouter from './routes/email.router.js'
import smsRouter from './routes/sms.router.js'
import ProductRouter from "./routes/products.router.js";
import compression from "express-compression";

const app = express();
const PORT = config.port;
const DB = config.mongoUrl;
const sessionRouter = new SessionRouter();
const productRouter = new ProductRouter();
 
//Preparo al servidor para que pueda trabajar con archivos JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//GZIP
app.use(compression({
  brotli: {enabled:true, zlib: {}}
}))
//Habilito las politicas de cors
app.use(cors());

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
}));

//Cookies
app.use(cookieParser("coderS3cret"));

//middlewares
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

//Routes
app.use('/api/products', productRouter.getRouter());
app.use('/api/carts', cartsRoutes);
app.use("/users", usersViewRouter);
app.use("/api/sessions", sessionRouter.getRouter());
app.use('/', viewsRoutes);
app.use('/github', githubLoginViewRouter);
app.use('/api/email', emailRouter)
app.use('/api/sms', smsRouter)
app.listen(PORT, () => {
  console.log(`Server run on port: ${PORT}`);
});

//conexion con DB
const connectMongoDb = async()=>{
  try {
    await MongoSingleton.getInstance();
    console.log("conectado a la base usando mongoose");
  } catch (error) {
    console.log("no se pudo conectar a la base de datos");
  }
}
connectMongoDb();
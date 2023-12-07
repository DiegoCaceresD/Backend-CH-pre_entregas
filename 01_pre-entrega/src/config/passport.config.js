import passport from "passport";
import passportLocal from "passport-local";
import userModel from "../services/dao/db/models/user.model.js";
import GitHubStrategy from "passport-github2";
import { createHash, isValidPassword, generateJWToken } from "../utils.js";
import jwtStrategy from "passport-jwt";
import { PRIVATE_KEY } from "../utils.js";
import { cartsService } from "../services/factory.js" 
//estrategia
const localStrategy = passportLocal.Strategy;
const JwtStrategy = jwtStrategy.Strategy;
const ExtractJWT = jwtStrategy.ExtractJwt;

const initializePassport = () => {
  //---------------------JWT--------------------
  passport.use(
    "jwt",
    new JwtStrategy(
      //extraer cookie
      {
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: PRIVATE_KEY,
      },
      async (jwt_payload, done) => {
        console.log("inicio - Passport Strategy JWT");
        try {
          console.log("JWT obtenido del payload: ", jwt_payload);
          console.log("fin - Passport Strategy JWT");
          return done(null, jwt_payload.user);
        } catch (error) {
          console.error(error);
          return done(error);
        }
      }
    )
  );

  //---------------------- GITHUBSTRATEGY --------------
  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: "Iv1.7144d031f0ab84e6",
        clientSecret: "4d559d7993b29caed4b7b1a772253dff0590ce5c",
        callbackUrl: "http://localhost:8080/api/sessions/githubcallback",
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log("profile obtenido del usuario: ", profile);

        try {
          const user = await userModel.findOne({ email: profile._json.email });
          if (!user) {
            console.log("usuario no existe: ", profile._json.email);
            let newUser = {
              first_name: profile._json.name,
              last_name: "",
              age: "",
              email: profile._json.email,
              password: "",
              loggedBy: "GitHub", // me permite saber desde donde se esta loggeando
            };
            const result = await userModel.create(newUser);
            done(null, result);
          } else {
            return done(null, user);
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  //register  ------------- LOCALSTRATEGY ------------------
  // passReqToCallback: para convertirlo en un callback de request, para asi poder iteracturar con la data que viene del cliente
  // usernameField: renombramos el username
  passport.use(
    "register",
    new localStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body;
        try {
          const userExist = await userModel.findOne({ email });
          if (userExist) {
            console.warn("Usuario ya existe: " + username);
            return done(null, false);
          }
          const newCart = await cartsService.createCart();

          const user = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
            cart: newCart._id,
            loggedBy: "Local",
          };

          const result = await userModel.create(user);
          return done(null, result);
        } catch (error) {
          return done("Error registrando el usuario: " + error);
        }
      }
    )
  );

  //login
  passport.use(
    "login",
    new localStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, username, password, done) => {
        // const { first_name, last_name, email, age } = req.body;
        try {
          const user = await userModel.findOne({ email: username });

          if (!user) {
            console.warn("Usuario no existe: " + username);
            return done(null, false);
          }
          //validacion con bcrypt
          if (!isValidPassword(user, password)) {
            console.log("invalid credentials for user: " + username);
            return done(null, false);
          }

          const tokenUser = {
            name: `${user.first_name} ${user.last_name}`,
            email: user.email,
            age: user.age,
            role: user.role,
          };

          const access_token = generateJWToken(tokenUser);
          console.log("access_token login localStrategy: ", access_token);

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  //serializacion y desserializacion

  //serializacion determina que datos del usuario se deben almacenar en la sesion
  //desserializacion recuperar los datos del usuario a partir de una sesion

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });
  passport.deserializeUser(async (id, done) => {
    try {
      let user = await userModel.findOne({ password: id });
      done(null, user);
    } catch (error) {
      console.error("Error deserializando el usuario: " + error);
    }
  });
};

// funcion para extraer cookie
const cookieExtractor = (req) => {
  let token = null;
  console.log("Inicio - Cookie Extractor");
  if (req && req.cookies) {
    console.log("cookies presentes: ", req.cookies);
    token = req.cookies["access_Token"];
    console.log("Token obtenido desde Cookie: ", token);
  }
  console.log("Fin - Cookie Extractor");
  return token;
};
export default initializePassport;

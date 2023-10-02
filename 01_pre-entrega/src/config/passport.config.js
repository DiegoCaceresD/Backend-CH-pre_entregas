import passport from "passport";
import passportLocal from "passport-local";
import userModel from "../db/models/user.model.js";
import { createHash, isValidPassword } from "../utils.js";

//estrategia
const localStrategy = passportLocal.Strategy;

const initializePassport = () => {
  //register

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

          const user = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
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

  passport.use("login",new localStrategy({ passReqToCallback: true, usernameField: "email" }, async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body;
        try {
          const user = await userModel.findOne({ email: username });

          if (!user) {
            console.warn("Usuario no existe: " + username);
            return done(null, false);
          }
          //validacion con bcrypt
          if (!isValidPassword(user, password)) {
            return res
              .status(401)
              .send({ status: "error", error: "Incorrect credentials" });
          }

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

export default initializePassport;

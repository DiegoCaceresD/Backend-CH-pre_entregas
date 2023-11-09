import { Router } from "express";
import userModel from "../db/models/user.model.js";
import { createHash, generateJWToken, isValidPassword } from "../utils.js";
import passport from "passport";
import CustomRouter from "./custom/custom.router.js";
const router = Router();

export default class SessionRouter extends CustomRouter{
  init(){

    //GITHUB
    this.get(
      "/github",["PUBLIC"],
      passport.authenticate("github", { scope: ["user:email"] }),
      async (req, res) => {}
    );
    
    //githubcallback 
    this.get(
      "/githubcallback",["PUBLIC"],
      passport.authenticate("github", { failureRedirect: "/github/error" }),
      async (req, res) => {
        const user = req.user;
        req.session.user = {
          name: `${user.first_name} ${user.last_name}`,
          email: user.email,
          age: user.age,
        };
        req.session.admin = true;
        res.redirect("/users");
      }
    );
    
    this.post(
      "/register",["PUBLIC"],
      passport.authenticate("register", {
        failureRedirect: "/api/sessions/fail-register",
      }),
      async (req, res) => {
        console.log(req.user.first_name);
        res.sendCreated(`Usuario: ${req.user.first_name} ${req.user.last_name}`);
      }
    );
    
    // router.post("/login",passport.authenticate("login", {failureRedirect: "/api/sessions/fail-login"}),async (req, res) => {
    //     const user = req.user;
    //   console.log("login: ", user);
    //     if (!user)
    //       return res
    //         .status(401)
    //         .send({ status: "error", error: "credenciales incorrectas" });
    
    //         const access_token = generateJWToken(user);
    //         console.log("metodo: login-session-router access_token: ",access_token);
    //         res.send({access_token: access_token});
    //   }
    // );
    this.post(
      "/login",["PUBLIC"],
      passport.authenticate("login", {
        failureRedirect: "/api/sessions/fail-login",
      }),
      async (req, res) => {
        const { email, password } = req.body;
        try {
          const user = await userModel.findOne({ email: email });
          console.log("user encontrado: ", user);
          if (!user) {
            console.warn("User doesn't exists with username: " + email);
            return res
              .sendNotFoundError(`Usuario ${user} no encontrado`);
          }
          if (!isValidPassword(user, password)) {
            console.warn("Invalid credentials for user: " + email);
            return res
              .sensendUnauthorizedError("El Usuario y la Contraseña no coinciden");
          }
    
          const tokenUser = {
            name: `${user.first_name} ${user.last_name}`,
            email: user.email,
            age: user.age,
            role: user.role,
          };
    
          const accessToken = generateJWToken(tokenUser);
          console.log("token generado en el login: ", accessToken);
    
          //Cookies
          res.cookie('access_Token', accessToken, {
            maxAge: 60000,
            httpOnly:false //true = no se expone la cookie / false si se expone y s epuede acceder mediante el objeto document.cookie 
          });
    
          res.send({message:"Login Succesful!"})
        } catch (error) {
          console.error(error);
          return res
            .sendInternalServerError("Error interno en la aplicacion");
        }
      }
    );
    
    this.get("/fail-register",["PUBLIC"], (req, res) => {
      res.sendsendUnauthorizedError("Failed to process register");
    });
    
    this.get("/fail-login",["PUBLIC"], (req, res) => {
      res.sendsendUnauthorizedError("Failed to process login");
    });

  }
}



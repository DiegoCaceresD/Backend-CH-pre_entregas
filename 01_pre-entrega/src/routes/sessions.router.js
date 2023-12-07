import { Router } from "express";
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
    
    this.post(
      "/login",["PUBLIC"],
      passport.authenticate("login", {
        failureRedirect: "/api/sessions/fail-login",
      }), async (req, res) => {
          console.log("User found to login:");
          const user = req.user;
          console.log(user);
    
          if (!user) CustomError.createError({name: "User Login", cause:"Credenciales incorrectas", code:EErrors.INVALID_CREDENTIALS, message: user });
    
          req.session.user = {
            name: `${user.first_name} ${user.last_name}`,
            email: user.email,
            age: user.age
        }
        res.send({ status: "success", payload: req.session.user, message: "Loggeado exitosamente" }); 
      }
    );
    
    this.get("/fail-register",["PUBLIC"], (req, res) => {
      res.sendUnauthorizedError("Failed to process register");
    });
    
    this.get("/fail-login",["PUBLIC"], (req, res) => {
      res.sendUnauthorizedError("Failed to process login");
    });

  }
}



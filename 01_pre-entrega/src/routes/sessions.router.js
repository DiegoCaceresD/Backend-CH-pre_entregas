import { Router } from "express";
import userModel from "../db/models/user.model.js";
import { createHash, generateJWToken, isValidPassword } from "../utils.js";
import passport from "passport";
const router = Router();

//GITHUB
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  async (req, res) => {}
);

//githubcallback
router.get(
  "/githubcallback",
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

router.post(
  "/register",
  passport.authenticate("register", {
    failureRedirect: "/api/sessions/fail-register",
  }),
  async (req, res) => {
    res
      .status(201)
      .send({ status: "succes", message: "Usuario creado con exito" });
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
router.post(
  "/login",
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
          .status(204)
          .send({
            error: "Not found",
            message: "Usuario no encontrado con username: " + email,
          });
      }
      if (!isValidPassword(user, password)) {
        console.warn("Invalid credentials for user: " + email);
        return res
          .status(401)
          .send({
            status: "error",
            error: "El usuario y la contraseña no coinciden!",
          });
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
        .status(500)
        .send({ status: "error", error: "Error interno de la applicacion." });
    }
  }
);

router.get("/fail-register", (req, res) => {
  res.status(401).send({ error: "Failed to process register!" });
});

router.get("/fail-login", (req, res) => {
  res.status(401).send({ error: "Failed to process login!" });
});

export default router;

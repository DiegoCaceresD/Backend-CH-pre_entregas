import { Router } from "express";
import userModel from "../db/models/user.model.js";
import { createHash, isValidPassword } from "../utils.js";
import passport from "passport";
const router = Router();

//GITHUB

router.post("/register",passport.authenticate("register", {failureRedirect: "/api/sessions/fail-register"}), async (req, res) => {
    res
      .status(201)
      .send({ status: "succes", message: "Usuario creado con exito" });
  }
);

router.post("/login",passport.authenticate("login", {failureRedirect: "/api/sessions/fail-login"}),async (req, res) => {
    const user = req.user;

    if (!user)
      return res
        .status(401)
        .send({ status: "error", error: "credenciales incorrectas" });
    req.session.user = {
      name: `${user.first_name} ${user.last_name}`,
      email: user.email,
      age: user.age,
    };
    res.send({
      status: "success",
      payload: req.session.user,
      message: "¡Primer logueo realizado! :)",
    });
  }
);

router.get("/fail-register", (req, res) => {
  res.status(401).send({ error: "Failed to process register!" });
});

router.get("/fail-login", (req, res) => {
  res.status(401).send({ error: "Failed to process login!" });
});

export default router;

const router = require("express").Router();

// ℹ️ Handles password encryption
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

// // How many rounds should bcrypt run the salt (default [10 - 12 rounds])
// const saltRounds = 10;

// Require the User model in order to interact with the database
const User = require("../models/User.model");

// Require necessary (isLoggedOut and isLiggedIn) middleware in order to control access to specific routes
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");



//Renderizar el formulario de sign up
router.get("/signup", (req, res, next) => {
  res.render("signup");
});

//Renderizar el formulario de login
router.get("/login", (req, res, next) => {
  res.render("login");
});

//POST para crear un nuevo usuario
router.post("/signup", async (req, res, next) => {
  const { username, email, password, passwordRepeat } = req.body;

  //Verificar que no hay ningún campo vacío
  if (!username || !email || !password || !passwordRepeat) {
    res.render("signup.hbs", { msg: "You need to fill all inputs" });
    return;
  }

  // Compara contraseñas
  if (password !== passwordRepeat) {
    res.render("signup.hbs", { msg: "Passwords does not match" });
    return;
  }

  //Verificar que la contraseña tiene mínimo 8 letras
  if (password.length < 8) {
    res.render("signup.hbs", {
      msg: "Your password should be at least 8 characters long",
    });
    return;
  }

  //Verificar que el usuario no existe ya
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    res.render("signup", { msg: "This user already has an account" });
    return;
  }

  //Verificar el correcto formato del correo
  if (/\S+@\S+\.\S+/.test(email) === false) {
    res.render("signup", { msg: "Please put a valid email" });
  }

  //Proceso para crear el usuario
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const createdUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });
    res.redirect("/login");
  } catch (err) {
    console.log(err);
  }
});

//POST para hacer login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  //Verificar que ningun campo esta vacio
  if (!username || !password) {
    res.render("login", { msg: "You need to fill all inputs" });
    return;
  }
  //Verificar si el usuario existe
  const existingUser = await User.findOne({ username: username });
  if (!existingUser) {
    res.render("login", { msg: "User doesn't exist" });
    return;
  }

  //Verificar si la contraseña es correcta
  const passwordMatch = await bcrypt.compare(password, existingUser.password);
  if (!passwordMatch) {
    res.render("login", { msg: "Incorrect password" });
    return;
  }
  //Hacer login
  req.session.loggedUser = existingUser;
  console.log("SESSION ====> ,", req.session);
  res.redirect('/profile') 
});

//POST logout
router.get("/logout", async (req, res, next) => {
  res.clearCookie("connect.sid", { path: "/" });

  try {
    await req.session.destroy();
    res.redirect("/");
  } catch (err) {
    next(err);
  }
});

module.exports = router;

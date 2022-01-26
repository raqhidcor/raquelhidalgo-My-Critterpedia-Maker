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

//Render sign up form
router.get("/signup", (req, res, next) => {
  res.render("signup");
});

//Render login form
router.get("/login", (req, res, next) => {
  res.render("login");
});

//POST route to create a new user
router.post("/signup", async (req, res, next) => {
  const { username, email, password, passwordRepeat } = req.body;

  //Checks that there is not any blank input
  if (!username || !email || !password || !passwordRepeat) {
    res.render("signup.hbs", { msg: "You need to fill all inputs" });
    return;
  }

  // Compare password
  if (password !== passwordRepeat) {
    res.render("signup.hbs", { msg: "Passwords does not match" });
    return;
  }

  //Checks that the password is at least 8 characters long
  if (password.length < 8) {
    res.render("signup.hbs", {
      msg: "Your password should be at least 8 characters long",
    });
    return;
  }

  //Checks if the user already has an account
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    res.render("signup", { msg: "This user already has an account" });
    return;
  }

  //Checks if the emal format is valid
  if (/\S+@\S+\.\S+/.test(email) === false) {
    res.render("signup", { msg: "Please put a valid email" });
  }

  //Process to create new user
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

//POST route to login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  //Checks that there is not any blank input
  if (!username || !password) {
    res.render("login", { msg: "You need to fill all inputs" });
    return;
  }
  //Checks if the user exists
  const existingUser = await User.findOne({ username: username });
  if (!existingUser) {
    res.render("login", { msg: "User doesn't exist" });
    return;
  }

  //Checks if the password is correct
  const passwordMatch = await bcrypt.compare(password, existingUser.password);
  if (!passwordMatch) {
    res.render("login", { msg: "Incorrect password" });
    return;
  }
  //To login
  req.session.loggedUser = existingUser;
  console.log("SESSION ====> ,", req.session);
  res.redirect("/profile");
});

//POST route logout
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

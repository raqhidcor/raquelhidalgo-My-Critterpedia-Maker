
const router = require("express").Router();
const chalk = require("chalk");
const axios = require("axios");

const Critter = require("../models/Critter.model");
const User = require("../models/User.model");

//My own middleware
const isLoggedIn = require("../middleware/isLoggedIn")

router.get("/toCatch", isLoggedIn ,(req, res, next) => {
  const loggedUser = req.session.loggedUser
  res.render("toCatched");
});


module.exports = router;

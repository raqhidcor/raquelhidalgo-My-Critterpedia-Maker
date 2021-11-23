const router = require("express").Router();
const chalk = require("chalk");
const axios = require("axios");

const Critter = require("../models/Critter.model");
const User = require("../models/User.model");

//My own middleware
const isLoggedIn = require("../middleware/isLoggedIn")

router.get("/critters-bugs", isLoggedIn, async (req, res) => {
    try {
      const axiosCall = await axios(`http://acnhapi.com/v1/bugs/`)
      const bugsInfo = axiosCall.data;
      res.render("./bugs.hbs", { bugsInfo });
    } catch (err) {
      console.log(chalk.bgRed(err));
    }
  });


module.exports = router;
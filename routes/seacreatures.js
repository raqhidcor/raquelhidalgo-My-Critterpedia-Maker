const router = require("express").Router();
const chalk = require("chalk");
const axios = require("axios");

const Critter = require("../models/Critter.model");
const User = require("../models/User.model");

//My own middleware
const isLoggedIn = require("../middleware/isLoggedIn");

router.get("/critters-seacreatures", isLoggedIn, async (req, res) => {
  try {
    const axiosCall = await axios(`http://acnhapi.com/v1/sea/`);
    const seaInfo = axiosCall.data;
    res.render("./seacreatures.hbs", { seaInfo });
  } catch (err) {
    console.log(chalk.bgRed(err));
  }
});

module.exports = router;

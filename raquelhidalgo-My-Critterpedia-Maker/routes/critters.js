// const router = require("express").Router();
// const axios  = require("axios");
// const chalk  = require("chalk")

// const Critter = require("../models/Critter.model");
// const User = require("../models/User.model");

// const {isLoggedIn} = require("../middleware/isLoggedIn")

// /* GET critters page */

// router.get("/critters", (req, res, next) => {
//   res.render("critters");
// });

// module.exports = router;

const router = require("express").Router();
const isLoggedIn = require("../middleware/isLoggedIn")
/* GET profile page */
router.get("/critters", isLoggedIn ,(req, res, next) => {
  const loggedUser = req.session.loggedUser
  res.render("critters");
});

module.exports = router;

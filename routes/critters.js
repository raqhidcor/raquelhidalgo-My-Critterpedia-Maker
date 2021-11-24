

const router = require("express").Router();
const chalk = require("chalk");
const axios = require("axios");

const Critter = require("../models/Critter.model");
const User = require("../models/User.model");

//My own middleware
const isLoggedIn = require("../middleware/isLoggedIn")

router.get("/critters", isLoggedIn ,(req, res, next) => {
  const loggedUser = req.session.loggedUser
  res.render("critters");
});



// router.post("/create/:id", async (req, res) => {
//   const axiosCall = await axios(
//     `http://acnhapi.com/v1/fish/`
//   );

//   const infoFromCritter = axiosCall.data.data.results;

//   const dataToUpload = {
//     name: infoFromCritter[0].name,
//     location: infoFromCritter[0].location,
//     rarity: infoFromCritter[0].rarity,
//     catchPhrase: infoFromCritter[0].catchPhrase,
//     image: infoFromCritter[0].image
//    };

//   const justCreatedCritter = await Critter.create(dataToUpload);

//   await User.findByIdAndUpdate(
//     req.session.loggedUser._id,
//     { $push: { critters: justCreatedCritter._id } },
//     { new: true }
//   );

//   res.redirect('/')
// });

module.exports = router;

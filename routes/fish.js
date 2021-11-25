

const router = require("express").Router();
const chalk = require("chalk");
const axios = require("axios");

const Critter = require("../models/Critter.model");
const User = require("../models/User.model");

//My own middleware
const isLoggedIn = require("../middleware/isLoggedIn")

router.get("/critters-fish", isLoggedIn, async (req, res) => {
    try {
      const axiosCall = await axios(`http://acnhapi.com/v1/fish/`)
      const fishInfo = axiosCall.data;
      // console.log (fishInfo)
      res.render("./fish.hbs", { fishInfo });
    } catch (err) {
      console.log(chalk.bgRed(err));
    }
  });


// router.post("/create/id", async (req, res) => {
//   const axiosCall = await axios(
//     `http://acnhapi.com/v1/fish/id`
//   );

//   const infoFromCritter = axiosCall.data;

//   const dataToUpload = {
//     name: infoFromCritter[0].name,
//     location: infoFromCritter[0].location,
//     rarity: infoFromCritter[0].rarity,
//     catchPhrase: infoFromCritter[0].catchPhrase,
//     image: infoFromCritter[0].image_uri
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

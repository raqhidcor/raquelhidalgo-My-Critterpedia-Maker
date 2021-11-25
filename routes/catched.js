const router = require("express").Router();
const chalk = require("chalk");
const axios = require("axios");

const Critter = require("../models/Critter.model");
const User = require("../models/User.model");

//My own middleware
const isLoggedIn = require("../middleware/isLoggedIn");

router.get("/catched", isLoggedIn,async (req, res, next) => {

  const loggedUser = req.session.loggedUser;
  const currUsr = await User.findById(loggedUser._id).populate('crittersCatched')
  res.render("catched" , {critters: currUsr.crittersCatched});
});

router.post("/catched/:type/:id", async (req, res) => {
    try {
      const axiosCall = await axios(
        `http://acnhapi.com/v1/${req.params.type}/${req.params.id}`
      );

      const info = axiosCall.data;

      const dataToUpload = {
        name: info.name["name-USen"],
        location: info.availability.location,
        rarity: info.availability.rarity,
        shadow: info.shadow,
        price: info.price,
        museumPhrase: info["museum-phrase"],
        image: info.image_uri,
      };

      const critterCatched = await Critter.create(dataToUpload);

      await User.findByIdAndUpdate(
        req.session.loggedUser._id,
        { $push: { crittersCatched: critterCatched._id } },
        { new: true }
      );
      res.redirect("/catched");
    } catch (err) {
      console.log("Error", err);
    }

});


module.exports = router;

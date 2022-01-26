const router = require("express").Router();
const chalk = require("chalk");
const axios = require("axios");

const Critter = require("../models/Critter.model");
const User = require("../models/User.model");

//My own middleware
const isLoggedIn = require("../middleware/isLoggedIn");

//Create toCatch route

router.get("/toCatch", isLoggedIn, async (req, res, next) => {
  const loggedUser = req.session.loggedUser;
  const currUsr = await User.findById(loggedUser._id).populate(
    "crittersToCatch"
  );
  res.render("toCatched", { critters: currUsr.crittersToCatch });
});

// Delete critter in toCatch

router.post("/toCatch/delete/:id", async (req, res) => {
  try {
    await Critter.findByIdAndDelete(req.params.id);
    await User.findByIdAndUpdate(req.session.loggedUser._id, {
      $pull: { crittersToCatch: req.params.id },
    });
  } catch (err) {
    console.log(err);
  }
  res.redirect(`/toCatch`);
});

//Create critter in toCatch

router.post("/toCatch/:type/:id", async (req, res) => {
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

    const critterToCatch = await Critter.create(dataToUpload);

    await User.findByIdAndUpdate(
      req.session.loggedUser._id,
      { $push: { crittersToCatch: critterToCatch._id } },
      { new: true }
    );
    res.redirect("/toCatch");
  } catch (err) {
    console.log("Error", err);
  }
});

module.exports = router;

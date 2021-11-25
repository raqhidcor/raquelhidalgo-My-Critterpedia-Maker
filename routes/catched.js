const router = require("express").Router();
const chalk = require("chalk");
const axios = require("axios");

const Critter = require("../models/Critter.model");
const User = require("../models/User.model");

//My own middleware
const isLoggedIn = require("../middleware/isLoggedIn")

router.get("/catched", isLoggedIn ,(req, res, next) => {
  const loggedUser = req.session.loggedUser
  res.render("catched");
});

router.post("/catched/:id", async (req, res) => {
  try{
    const axiosCall = await axios(`http://acnhapi.com/v1/fish/${req.params.id}`)

    const infoFromFish = axiosCall.data
      
    const dataToUpload = {
      name: infoFromFish.name.name-USen,  
      location: infoFromFish.availability.location,
      rarity: infoFromFish.availability.rarity,
      shadow: infoFromFish.shadow,
      price: infoFromFish.price,
      museumPhrase: infoFromFish.museum-phrase,
      image: infoFromFish.image_uri,
    }
  
      const fishToCatch = await Fish.create(dataToUpload)
  
      await User.findByIdAndUpdate(req.session.loggedUser._id,
        {$push: {critters: fishToCatch._id}},
        {new: true}
      );
  
      res.redirect('/catched')
      } catch(err){
          console.log ("Error",err)
      }
  });
  

module.exports = router;

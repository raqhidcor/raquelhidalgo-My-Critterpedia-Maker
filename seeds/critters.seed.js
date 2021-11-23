
const mongoose = require('mongoose')
const Critter = require('../models/Critter.model') 

const critters = [
    {
      name: "Bitterling",
      location: "River",
      rarity: "Common",
      catchPhrase: "I caught a bitterling! It's mad at me, but only a little.",
      image:
       "https://acnhapi.com/v1/icons/fish/1"
    },
    {
      
    }
]


// Add here the script that will be run to actually seed the database 
  
const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost/raquelhidalgo-My-Critterpedia-Maker";

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  })
  .then((x) => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`);
  })
  .catch((err) => {
    console.error("Error connecting to mongo: ", err);
  });

  const crittersCreate = async () => {
    try {
      await Critter.create(critters)
      await mongoose.connection.close();
    } catch (err) {
      console.log('Error:', err)
    }
  }
  
  crittersCreate();

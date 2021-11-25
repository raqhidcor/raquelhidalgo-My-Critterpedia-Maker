const {Schema,model} = require("mongoose");

const critterSchema = new Schema(
    {
      name: {type:String,required:true},
      location: {type:String},
      rarity: {type:String},
      shadow: {type:String},
      price: {type:Number},
      museumPhrase: {type:String},
      image: {type:String}
    },
    { timestamps: true }
);

const Critter = model("Critter",critterSchema );

module.exports = Critter;
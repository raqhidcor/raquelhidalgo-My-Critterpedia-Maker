const {Schema,model} = require("mongoose");

const critterSchema = new Schema(
    {
      name: {type:String,required:true},
      location: {type:String, required:true},
      rarity: {type:String,required:true},
      catchPhrase: {type:String},
      image: {type:String}
    },
    { timestamps: true }
);

const Critter = model("Critter",critterSchema );

module.exports = Critter;
const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema(
  {
    username: {type: String, required:true,unique:true},
    password: {type:String,required:true},
    email: {
      type:String,
      lowecase:true,
      unique:true,
      required: [true, "Can't be blank"],
      match: [/\S+@\S+\.\S+/, "Email not valid"]
    },
    crittersCatched: [{type:Schema.Types.ObjectId,ref:"crittersCatched"}],
    crittersToCatch: [{type:Schema.Types.ObjectId, ref:"CrittersToCatch"}]
  },
  {timestamps: true}
);

const User = model("User", userSchema);

module.exports = User;

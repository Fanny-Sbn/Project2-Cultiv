const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  pseudo: String,
  email: String,
  password: String,
  fav: [String],
  pastFav: [String],
  address: {
    name: String,
    numberOfStreet: Number,
    street: String,
    zip_code: String,
    city: String,
  },
});

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  pseudo: String,
  email: String,
  password: String,
  role: { //Doit-on mettre plusieurs rôles, différencier admin et user ou juste user ? Peut être commencer par un et voir si on a le temps pour l'admin (BONUS BE LIKE Hahahhahahahaha)
    type: String,
    enum: ["admin", "user"],
    default: "user"
  }
});

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;

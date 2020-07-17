const express = require("express");
const router = express.Router();
const userModel = require("./../models/User");
const bcrypt = require("bcrypt");

// form views

router.get("/signup", (req, res) => {
  res.render("auth/signup");
});

router.get("/signin", (req, res) => {
  res.render("auth/signin");
});

// action::Registering

router.post("/signup", (req, res, next) => {
  const user = req.body;
  if (!user.email || !user.password) {
    var msg = {
      status: "error",
      text: "Renseignez votre email et votre mot de passe.",
    };
    console.log(msg);
    return res.redirect("/auth/signup", { msg });
  } else {
    userModel
      .findOne({ email: user.email })
      .then((dbRes) => {
        if (dbRes) {
          var msg = {
            status: "error",
            text:
              "Cette adresse email est déjà liée à un compte. Connectez-vous ou utilisez un email différent !",
          };
          console.log(msg);
          return res.render("auth/signup", { msg });
        }

        const salt = bcrypt.genSaltSync(10);
        const hashed = bcrypt.hashSync(user.password, salt);
        user.password = hashed;

        userModel.create(user).then(() => res.redirect("/auth/signin"));
      })
      .catch(next);
  }
});

// action::Login

router.post("/signin", (req, res, next) => {
  const user = req.body;
  //might be useless bc of REQUIRE property in form
  if (!user.email || !user.password) {
    return res.redirect("/auth/signin");
  }

  userModel
    .findOne({ email: user.email })
    .then((dbRes) => {
      if (!dbRes) {
        var msg = { status: "error", text: "Email inconnu" };
        //console.log(msg);
        return res.render("auth/signin", { msg });
      }
      if (bcrypt.compareSync(user.password, dbRes.password)) {
        const { _doc: clone } = { ...dbRes };

        delete clone.password;

        req.session.currentUser = clone;
        return res.redirect("/");
      } else {
        var msg = { status: "error", text: "Mot de passe incorrect" };
        //console.log(msg);
        return res.render("auth/signin", { msg });
      }
    })
    .catch(next);
});

// action::Logout

router.get("/signout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/auth/signin");
  });
});

module.exports = router;

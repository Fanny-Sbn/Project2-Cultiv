const express = require("express");
var moment = require("moment");
const router = new express.Router();
const axios = require('axios');
const userModel = require("./../models/User");
const protectRoute = require("./../middlewares/protectRoute.js")

router.get("/", (req, res) => {
  let currentUserFav;
  if (req.session.currentUser) {
    let connected = true;
    userModel.findById(req.session.currentUser._id)
      .then(dbres => {
        currentUserFav = dbres.fav
        res.render("home", { js: ["map", "filter"], favoris: currentUserFav, connected });
      })
  } else {
    let connected = false;
    currentUserFav = null;
    res.render("home", { js: ["map", "filter"], favoris: currentUserFav, connected });
  }
});

router.get("/evenements/mydashboard",protectRoute, (req, res) => {
  let query = "";
  userModel
    .findById(req.session.currentUser._id)
    .then(function (dbRes) {
      let allFav = dbRes.fav;
      
      function updateQuery(arg) {
        arg.forEach((e) => {
          let prefix = "&q=";
          let q = `${prefix}id=${e}`;
          query += q;
        });
      }
      updateQuery(allFav);
    })
    .catch(function (error) {
      console.log(error);
    })
    axios.get(`https://opendata.paris.fr/api/records/1.0/search/?dataset=que-faire-a-paris-${query}`)
    .then(function (response) {
      let data = response.data.records;
      console.log(data);
      res.render("dashboard", { data })
    })
    .catch(function (error) {
      console.log(error);
    });
});

router.post("/add-favorite",protectRoute, (req, res) => {
  userModel
    .findByIdAndUpdate(req.session.currentUser._id, { $push: { fav: req.body.event } }, { new: true })
    .then(function (dbRes) { res.json(dbRes) })
    .catch(function (error) {
      console.log(error);
    });
});

router.post("/remove-favorite",protectRoute, (req, res) => {
  userModel
    .findByIdAndUpdate(req.session.currentUser._id, { $pull: { fav: req.body.event } }, { new: true })
    .then(function (dbRes) { res.json(dbRes) })
    .catch(function (error) {
      console.log(error);
    });
});


router.get("/evenement/:id", (req, res) => {
  const id = req.params.id;
  axios.get(`https://opendata.paris.fr/api/records/1.0/search/?dataset=que-faire-a-paris-&q=id=${id}`)
    .then(function (response) {
      let data = response.data.records[0].fields;
      console.log(data);
      res.render("oneEvent", { data })
    })
    .catch(function (error) {
      console.log(error);
    });
});


module.exports = router;

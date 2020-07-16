const express = require("express");
var moment = require("moment");
const router = new express.Router();
const axios = require('axios');
const userModel = require("./../models/User");

router.get("/", (req, res) => {
  let currentUser;
  if (req.session.currentUser){
    userModel.findById(req.session.currentUser._id)
    .then(dbres => {
      currentUser=dbres.fav 
      res.render("home", { js: ["map", "filter"], user : currentUser});
    })
  }else{
    currentUser = null;  
    res.render("home", { js: ["map", "filter"], user : currentUser});
  }
});

router.get("/evenements/mydashboard", (req, res) => {
  console.log(req.session.currentUser)
  userModel
    .findById(req.session.currentUser._id)
    .then(function (dbRes) {
      res.render("dashboard", { UserInfo: dbRes })
    })
    .catch(function (error) {
      console.log(error);
    });
});

router.post("/add-favorite", (req, res) => {
  userModel
    .findByIdAndUpdate(req.session.currentUser._id, { $push: { fav: req.body.event } }, { new: true })
    .then(function (dbRes) { res.json(dbRes) })
    .catch(function (error) {
      console.log(error);
    });
});

router.post("/remove-favorite", (req, res) => {
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

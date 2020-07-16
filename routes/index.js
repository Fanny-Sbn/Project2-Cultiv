const express = require("express");
var moment = require("moment");
const router = new express.Router();
const axios = require('axios');
const userModel = require("./../models/User");

router.get("/", (req, res) => {
  res.render("home", { js: ["map", "filter"] });
});

router.get("/evenements/mydashboard", (req, res) => {
  userModel
    .find()
    .then(function (dbRes) {
      res.render("dashboard", { UserInfo: dbRes })
    })
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

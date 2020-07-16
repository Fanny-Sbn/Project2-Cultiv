const express = require("express");
var moment = require("moment");
const router = new express.Router();
const axios = require('axios');

router.get("/", (req, res) => {
  res.render("home", { js: ["map", "filter"] });
});

router.get("/evenement/:id", (req, res) => {
  const id = req.params.id;
  res.render("oneEvent", { js: ["filter"]})
});

module.exports = router;

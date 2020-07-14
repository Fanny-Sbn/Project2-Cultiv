const express = require("express");
var moment = require("moment");
const router = new express.Router();

router.get("/", (req, res) => {
  res.render("home", { js: ["map","clean"] });
});

module.exports = router;

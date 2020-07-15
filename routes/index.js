const express = require("express");
var moment = require("moment");
const router = new express.Router();

router.get("/", (req, res) => {
  res.render("home", { js: ["clean", "filter"] });
});

module.exports = router;

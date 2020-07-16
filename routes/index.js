const express = require("express");
var moment = require("moment");
const router = new express.Router();
const axios = require('axios');

router.get("/", (req, res) => {
  res.render("home", { js: ["map", "filter"] });
});

router.get("/evenement/:id", (req, res) => {
  const id = req.params.id;
  axios.get(`https://opendata.paris.fr/api/records/1.0/search/?dataset=que-faire-a-paris-&q=id=${id}`)
    .then(function (response) {
      let data = response.data.records[0].fields;
      console.log(data);
      res.render("oneEvent", {data})
    })
    .catch(function (error) {
      console.log(error);
    });
});


/*   axios.get()
    .then(res => {
      var data = res.data.records;
      console.log(data);
      res.render("oneEvent", { data })
    })
    .catch((err) => {
      console.log(err);
    })
}); */

module.exports = router;

const express = require("express");
var moment = require("moment");
const router = new express.Router();
const axios = require("axios");
const userModel = require("./../models/User");
const protectRoute = require("./../middlewares/protectRoute.js");

router.get("/", (req, res) => {
  let currentUserFav;
  if (req.session.currentUser) {
    let connected = true;
    userModel.findById(req.session.currentUser._id).then((dbres) => {
      currentUserFav = dbres.fav;
      res.render("home", {
        js: ["map", "filter"],
        favoris: currentUserFav,
        connected,
      });
    });
  } else {
    let connected = false;
    currentUserFav = null;
    res.render("home", {
      js: ["map", "filter"],
      favoris: currentUserFav,
      connected,
    });
  }
});

router.get("/evenements/mydashboard", protectRoute, (req, res) => {
  let query = "q=";
  userModel
    .findById(req.session.currentUser._id)
    .then(function (dbRes) {
      let allFav = dbRes.fav;
      // if (!allFav.length) return           res.render("dashboard", { "data: myFavs" });
      // res.json({ records: [] });

      // function updateQuery(arg) {
      //   arg.forEach((e) => {
      //     //let prefix = "&";
      //     let q = `id=${e}&`;
      //     query += q;
      //   });
      // }

      let promises = allFav.map((fav) =>
        axios
          .get(
            `https://opendata.paris.fr/api/records/1.0/search/?dataset=que-faire-a-paris-&q=id=${fav}`
          )
          .catch((error) => console.log(error))
      );

      Promise.all(promises)
        .then((apiRes) => {
          let myFavs = [];
          apiRes.forEach((data) => {
            myFavs = [...myFavs, ...data.data.records];
          });
          res.render("dashboard", { data: myFavs });
        })
        .catch((error) => console.log(error));

      // updateQuery(allFav);
      // console.log(
      //   `https://opendata.paris.fr/api/records/1.0/search/?dataset=que-faire-a-paris-&q=&rows=2000`
      // );
      // axios
      //   .get(
      //     `https://opendata.paris.fr/api/records/1.0/search/?dataset=que-faire-a-paris-&q=&rows=2000`
      //   )
      //   .then(function (response) {
      //     let data = response.data.records;
      //     const myFavs = data.filter((record) => {
      //       return allFav.includes(record.fields.id);
      //     });
      //     console.log(myFavs.length, allFav.length);
      //     res.render("dashboard", { data: myFavs });
      //   })
      //   .catch(function (error) {
      //     console.log(error);
      //   });
    })
    .catch(function (error) {
      console.log(error);
    });
});

router.post("/add-favorite", protectRoute, (req, res) => {
  userModel
    .findByIdAndUpdate(
      req.session.currentUser._id,
      { $push: { fav: req.body.event } },
      { new: true }
    )
    .then(function (dbRes) {
      res.json(dbRes);
    })
    .catch(function (error) {
      console.log(error);
    });
});

router.post("/remove-favorite", protectRoute, (req, res) => {
  userModel
    .findByIdAndUpdate(
      req.session.currentUser._id,
      { $pull: { fav: req.body.event } },
      { new: true }
    )
    .then(function (dbRes) {
      res.json(dbRes);
    })
    .catch(function (error) {
      console.log(error);
    });
});

router.get("/evenement/:id", (req, res) => {
  const id = req.params.id;
  axios
    .get(
      `https://opendata.paris.fr/api/records/1.0/search/?dataset=que-faire-a-paris-&q=id=${id}`
    )
    .then(function (response) {
      let data = response.data.records[0].fields;
      //console.log(data);
      res.render("oneEvent", { data });
    })
    .catch(function (error) {
      console.log(error);
    });
});

module.exports = router;

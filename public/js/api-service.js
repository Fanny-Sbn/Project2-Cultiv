//const service = axios.create({
//  baseURL: "http://localhost:3000"
//});

let axios = require("axios");
let fs = require("fs");
const date = new

// https://opendata.paris.fr/api/records/1.0/search/?dataset=que-faire-a-paris-&q=(start105220%20OR%20id:85700)

axios
  .get(
    "https://opendata.paris.fr/api/records/1.0/search/?dataset=que-faire-a-paris-&rows=0"
  )
  .then((res) => {
    return res.data.nhits;
  })
  .then((nhits) => {
    axios
      .get(
        `https://opendata.paris.fr/api/records/1.0/search/?dataset=que-faire-a-paris-&rows=${nhits}`
      )
      // .then((res) => {
      //   const { data } = res;
      //   const { records } = data;
      //   const myBeautifulData = records.map((row) => {
      //     const { fields } = row;

      //     const { coordinates, category, description, tags } = fields;

      //     let clean_tags = [];
      //     try {
      //       clean_tags = tags.split(";");
      //     } catch (e) {
      //       console.log(e);
      //     }

//export default service;

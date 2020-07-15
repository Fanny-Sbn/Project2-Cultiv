// function cleanOccurrence(occurrences) {
//   let plageshoraires = occurrences.split(";");
//   return plageshoraires.map((element) => element.split("_"));
// }

// function isNow(cleanedOccurences) {
//   let u = false;
//   cleanedOccurences.forEach((h) => {
//     let h0 = new Date(h[0]);
//     let h1 = new Date(h[1]);
//     let now = new Date();
//     let u = moment(now).isBetween(h0, h1);
//     if (u == true) console.log(now, h[0], h[1], u);
//   });
//   return u;
// }

// axios
//   .get(
//     `https://opendata.paris.fr/api/records/1.0/search/?dataset=que-faire-a-paris-&q=&rows=50`
//   )
//   .then((res) => {
//     let data = [];
//     res.data.records.forEach((e) => {
//       if (e.fields.occurrences != undefined || e.fields.occurrences != null) {
//         if (e.fields.address_city == "Paris") {
//           data.push(e);
//         }
//       }
//     });
//     let finalArr = data.map((e) => {
//       let { fields } = e;
//       let { occurrences, ...rest } = fields;
//       let cleanedOccurences = cleanOccurrence(occurrences);
//       let modifiedEvent = {
//         occurrences: cleanedOccurences,
//         isNow: isNow(cleanedOccurences),
//         ...rest,
//       };
//       console.log("ONE EVENT", modifiedEvent);
//       return modifiedEvent;
//     });
//     console.log("FINAL ARRAY WITH ALL EVENTS", finalArr);
//   })
//   .catch((err) => {
//     console.log(err);
//   });

axios
  .get(
    `https://opendata.paris.fr/api/records/1.0/search/?dataset=que-faire-a-paris-&q=&rows=50`
  )
  .then((res) => {
    let data = [];
    res.data.records.forEach((e) => {
      if (e.fields.occurrences != undefined || e.fields.occurrences != null) {
        if (e.fields.address_city == "Paris") {
          data.push(e);
        }
      }
    });
    let horaires = data.map((e) => {
      let { fields } = e;
      let { occurrences, ...rest } = fields;
      let cleanedOccurences = cleanOccurrence(occurrences);
      function cleanOccurrence(occurrences) {
        let plageshoraires = occurrences.split(";");
        return plageshoraires.map((element) => element.split("_"));
        //console.log(plageshoraires);
      }
      // function partOfTheDay(cleanedOccurences){
      //   start=new Date();
      //   end=;
      // }
      // function hasMorning(cleanedOccurences) {

      // }
      // function hasAfternoon(cleanedOccurences) {}
      // function hasEvening(cleanedOccurences) {}
      // function hasNight(cleanedOccurences) {}
      function isNow(cleanedOccurences) {
        //console.log(cleanedOccurences);
        let u = false;
        cleanedOccurences.forEach((h) => {
          let h0 = new Date(h[0]);
          let h1 = new Date(h[1]);
          //console.log(h[0], h[1]);
          let now = new Date();
          //console.log(now);
          let u = moment(now).isBetween(h0, h1);
          if (u == true) console.log(now, h[0], h[1], u);

          //let tomorrow = new Date("2020-08-31T10:30:00+00:00");

          /* if (
            moment(now).isBefore(moment(h1)) &&
            moment(now).isAfter(moment(h0))
          ) {
            console.log(moment(now));
            // console.log(h0, tomorrow);
            u = true;
          }
          if (u == true) console.log(now, h[0], h[1], u); */
        });
        return u;
      }

      return {
        occurrences: cleanedOccurences,
        isNow: isNow(cleanedOccurences),
        ...rest,
      };
    });
    //console.log(horaires);
  })
  .catch((err) => {
    console.log(err);
  });
// ]06-13]
// ]13-18]
// ]18-22]
// ]22-06]

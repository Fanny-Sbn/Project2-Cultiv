let status = {
  gratuit: false,
  arrondissement: [],
  now: false,
};

function checkStatus() {
  let query = "";
  if (status.gratuit == true) query += '&q=(price_type="gratuit")';
  status.arrondissement.forEach((e, i) => {
    let prefix = i === 0 ? "&q=" : `OR`;
    let q = `${prefix} address_zipcode="${e}"`;
    query += q;
  });
  myFunction(query);
}

function cleanOccurrence(occurrences) {
  let plageshoraires = occurrences.split(";");
  return plageshoraires.map((element) => element.split("_"));
}

function isNow(cleanedOccurences) {
  let u = false;
  cleanedOccurences.forEach((h) => {
    let h0 = new Date(h[0]);
    let h1 = new Date(h[1]);
    let now = new Date();
    let u = moment(now).isBetween(h0, h1);
    //if (u == true) console.log(now, h[0], h[1], u);
  });
  return u;
}

function myFunction(query = "") {
  const res = axios
    .get(
      `https://opendata.paris.fr/api/records/1.0/search/?dataset=que-faire-a-paris-&q=&rows=2000${query}`
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
      let finalArr = data.map((e) => {
        let { fields } = e;
        let { occurrences, ...rest } = fields;
        let cleanedOccurences = cleanOccurrence(occurrences);
        let modifiedEvent = {
          occurrences: cleanedOccurences,
          isNow: isNow(cleanedOccurences),
          ...rest,
        };
        //console.log("ONE EVENT", modifiedEvent);
        return modifiedEvent;
      });
      console.log("FINAL ARRAY WITH ALL EVENTS", finalArr);
      console.log("LENGTH OF ALL EVENTS", finalArr.length);

      let allTitles = [];
      const events_pre = finalArr.forEach((event) => {
        if (
          (event.address_city == "Paris" && event.title != undefined) ||
          event.title != null
        ) {
          if (status.now && event.isNow) {
            allTitles.push(event.title);
          } else {
            allTitles.push(event.title);
          }
          //console.log(allTitles);
        }
        const listTitles = document.getElementById("titles");
        listTitles.innerHTML = "";
        //console.log("all titles length", allTitles.length);
        allTitles.forEach((e) => {
          let li = document.createElement(`li`);
          li.innerHTML = e;
          listTitles.append(li);
        });
      });
    })
    .catch((err) => {
      console.log(err);
    });
}
myFunction();

// let gratuit = document.getElementById("gratuit");
// let arrondissement = document.getElementById("arrondissement75012");
// //let checkbox = document.querySelectorAll("input");
// gratuit.addEventListener("change", defineQuery);
// arrondissement.addEventListener("change", defineQuery);
// //checkbox.addEventListener("change", defineQuery);
// console.log("all query selectors input", checkbox);

document.getElementById("gratuit").addEventListener("change", () => {
  status.gratuit = !status.gratuit;
  checkStatus();
});

let allArrondissements = document.querySelectorAll(".arrondissement");

allArrondissements.forEach((arrondissement) =>
  arrondissement.addEventListener("change", (event) => {
    if (event.target.checked) {
      status.arrondissement.push(arrondissement.id);
    } else {
      let newArr = status.arrondissement.filter(
        (oneArrondissement) => oneArrondissement != arrondissement.id
      );
      status.arrondissement = newArr;
    }
    console.log(status.arrondissement);
    checkStatus();
  })
);

// document
//   .getElementById("arrondissement75012")
//   .addEventListener("change", (event) => {
//     console.log("75012 CHECKED", event.target.checked);
//     if (event.target.checked) {
//       status.arrondissement.push("75012");
//     } else {
//       let newArr = status.arrondissement.filter(
//         (oneArrondissement) => oneArrondissement != "75012"
//       );
//       status.arrondissement = newArr;
//     }

//     console.log(status.arrondissement);
//     checkStatus();
//   });

// document
//   .getElementById("arrondissement75013")
//   .addEventListener("change", (event) => {
//     if (event.target.checked) {
//       status.arrondissement.push("75013");
//     } else {
//       let newArr = status.arrondissement.filter(
//         (oneArrondissement) => oneArrondissement != "75013"
//       );
//       status.arrondissement = newArr;
//     }
//     console.log(status.arrondissement);
//     checkStatus();
//   });

//myFunction(query);
// function defineQuery(evt) {
//   let query = "&q=&rows=20";
//   // let gratuit = '&q=(price_type="gratuit")';
//   // let arrondissement75012 = '&q=(address_zipcode="75012")}';
//   //let query =['&q=(price_type="gratuit")','&q=(address_zipcode="75012")']

//     // console.log("les inputs checked::: ----", input);

//     // filter.forEach((e) => {
//     //   if (evt.target.id == e.type) query += e.q;
//       //console.log("je suis e.q 111----", e.q);
//       //console.log("je suis query 222(inside if) ----", query);
//     // });
//     //console.log("je suis query en dehors 333----", query);
//     //console.log(filter[0].q + filter[1].q);
//   }
//   //console.log("je suis query (encore + en dehors)444----", query);

//   // if (query == "") {
//   //   const listTitles = document.getElementById("titles");
//   //   listTitles.innerHTML = "No results :(";
//   // } else myFunction(query);
// }

// function defineQueryArr(evt) {
//   let query = "";
//   if (evt.target.checked) {
//     query = '&q=(address_zipcode="75012"}';
//   }
//   myFunction(query);
// }

// if (input.checked) {
//     axios.get('https://opendata.paris.fr/api/records/1.0/search/?dataset=que-faire-a-paris-&q=(price_type="gratuit")').then((res) => {
//         console.log("ok");
//         console.log(res.data);
// }

//   .then((res) => {
//     let titles = res.data.records.map((e) => e.title);
//     console.log(titles);
//     return titles;
//   })

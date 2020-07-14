function myFunction(query = "&q=&rows=20") {
  const res = axios
    .get(
      `https://opendata.paris.fr/api/records/1.0/search/?dataset=que-faire-a-paris-${query}`
    )
    .then((res) => {
      let allTitles = [];
      const events_pre = res.data.records.forEach((event) => {
        if (
          (event.fields.address_city == "Paris" &&
            event.fields.title != undefined) ||
          event.fields.title != null
        ) {
          allTitles.push(event.fields.title);
          //console.log(allTitles);
        }
        const listTitles = document.getElementById("titles");
        listTitles.innerHTML = "";
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

let gratuit = document.getElementById("gratuit");
let arrondissement = document.getElementById("arrondissement75012");
//let checkbox = document.querySelectorAll("input");
gratuit.addEventListener("change", defineQuery);
arrondissement.addEventListener("change", defineQuery);
//checkbox.addEventListener("change", defineQuery);
console.log("all query selectors input", checkbox);

function defineQuery(evt) {
  let query = "&q=&rows=20";
  // let gratuit = '&q=(price_type="gratuit")';
  // let arrondissement75012 = '&q=(address_zipcode="75012")}';
  //let query =['&q=(price_type="gratuit")','&q=(address_zipcode="75012")']
  let filter = [
    { type: "gratuit", q: `&q=(price_type="gratuit")` },
    { type: "arrondissement75012", q: `&q=(address_zipcode="75012")` },
  ];
  if (evt.target.checked) {
    console.log("les inputs checked::: ----", input);

    filter.forEach((e) => {
      if (evt.target.id == e.type) query += e.q;
      //console.log("je suis e.q 111----", e.q);
      //console.log("je suis query 222(inside if) ----", query);
    });
    //console.log("je suis query en dehors 333----", query);
    //console.log(filter[0].q + filter[1].q);
  }
  //console.log("je suis query (encore + en dehors)444----", query);

  if (query == "") {
    const listTitles = document.getElementById("titles");
    listTitles.innerHTML = "No results :(";
  } else myFunction(query);
}

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

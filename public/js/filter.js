import { loadAllItems } from "./map.js";

let status = {
  gratuit: false,
  arrondissement: [],
  tags: [],
  now: true,
  date: null,
};

function checkStatus() {
  let query = "";
  if (status.gratuit == true) query += '&q=(price_type="gratuit")';
  status.arrondissement.forEach((e, i) => {
    let prefix = i === 0 ? "&q=" : `OR`;
    let q = `${prefix} address_zipcode="${e}"`;
    query += q;
  });
  status.tags.forEach((e, i) => {
    let prefix = i === 0 ? "&q=" : `OR`;
    let q = `${prefix} tags="${e}"`;
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
  let v = false;
  cleanedOccurences.forEach((h) => {
    let h0 = new Date(h[0]);
    let h1 = new Date(h[1]);
    let now = new Date();
    let isNow = moment(now).isBetween(h0, h1);
    let isDate = moment(status.date).isBetween(h0, h1);
    if (isNow) u = true;
    if (isDate) v = true;
    //console.log(status.date, v);
  });
  return { u, v };
}

function myFunction(query = "") {
  const res = axios
    .get(
      `https://opendata.paris.fr/api/records/1.0/search/?dataset=que-faire-a-paris-&q=&rows=2000${query}`
    )
    .then((res) => {
      let data = [];
      res.data.records.forEach((e) => {
        if (
          e.fields.occurrences != undefined ||
          e.fields.occurrences != null ||
          e.fields.title != undefined ||
          e.fields.title != null
        ) {
          if (
            e.fields.address_city == "Paris" &&
            (e.geometry != undefined || e.geometry != null)
          ) {
            data.push(e);
          }
        }
      });
      let modifiedArr = data.map((e) => {
        let geometry = e.geometry;
        let { fields } = e;
        let { occurrences, ...rest } = fields;
        let cleanedOccurences = cleanOccurrence(occurrences);
        let modifiedEvent = {
          occurrences: cleanedOccurences,
          isNow: isNow(cleanedOccurences).u,
          isDate: isNow(cleanedOccurences).v,

          ...rest,
          geometry,
        };
        return modifiedEvent;
      });
      let finalArr = modifiedArr;
      if (status.now) {
        finalArr = modifiedArr.filter((event) => {
          return event.isNow;
        });
      }
      if (status.date != null) {
        finalArr = modifiedArr.filter((event) => {
          return event.isDate;
        });
      }
      const listTitles = document.getElementById("titles");
      listTitles.innerHTML = "";
      const userEventsFav = document.getElementById("userFav").dataset.favoris;
      const userEventsFavArr = userEventsFav.split(",");
      const userConnexion = document.getElementById("connexion").dataset
        .connected;
      console.log(typeof userConnexion);

      finalArr.forEach((e) => {
        let li = document.createElement(`li`);
        let isFavorite = false;
        let titleFav = "";
        let classFavorite = "far";
        userEventsFavArr.forEach((userEvent) => {
          if (userEvent === e.id) {
            isFavorite = true;
            classFavorite = "fas";
          }
        });
        //console.log("IS FAVORITE", isFavorite);

        if (userConnexion === "true") {
          li.innerHTML = `<a href =/evenement/${e.id}>${e.title}</a>
            <br>
            <img class="img-popup" src=${e.cover_url}>
            <br>
            ${titleFav} <i data-evt-id="${e.id}" class="img-fav ${classFavorite} fa-heart"></i>
            <br>
            <p>
            ${e.address_name} 
            </p>
            <br>
            <p>
            ${e.date_description}
            </p>`;
        } else {
          li.innerHTML = `<a href =/evenement/${e.id}>
            ${e.title}
            </a>
            <br>
            <img class="img-popup" src=${e.cover_url}>
            <br>`;
        }
        listTitles.append(li);
      });
      let inputFav = document.querySelectorAll(".img-fav");
      inputFav.forEach((fav) => (fav.onclick = changeFavStatus));

      //console.log("final array", finalArr.length);
      const items = finalArr.map((event) => {
        return {
          type: "Feature",
          source: "items",
          geometry: {
            type: "Point",
            coordinates: [
              event.geometry.coordinates[0],
              event.geometry.coordinates[1],
            ],
          },
          properties: {
            id: event.id,
            place: event.address_name,
            title: event.title,
            img: event.cover_url,
            dateDescription: event.date_description,
          },
        };
      });
      loadAllItems(items);
    })
    .catch((err) => {
      console.log(err);
    });
}
myFunction();
document.getElementById("gratuit").addEventListener("change", () => {
  status.gratuit = !status.gratuit;
  checkStatus();
});
document.getElementById("now").addEventListener("change", () => {
  status.now = !status.now;
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
    checkStatus();
  })
);

let allTags = document.querySelectorAll(".tags");
allTags.forEach((tags) =>
  tags.addEventListener("change", (event) => {
    if (event.target.checked) {
      status.tags.push(tags.id);
    } else {
      let newArr = status.tags.filter((tag) => tag != tags.id);
      status.tags = newArr;
    }
    //console.log(status.tags);
    checkStatus();
  })
);

//Date

let inputDate = document.getElementsByClassName("date")[0];
let inputNow = document.getElementById("now");
inputDate.addEventListener("change", (e) => {
  status.date = e.target.value;
  inputNow.checked = false;
  // console.log(status.date);
  checkStatus();
  //if (u == true) console.log(now, h[0], h[1], u);
});

function changeFavStatus(e) {
  console.log(e);
  if (e.target.classList.contains("far")) {
    axios
      .post("/add-favorite", { event: e.target.dataset.evtId })
      .then((modifiedUser) => console.log(modifiedUser))
      .catch((err) => console.log(err));
    e.target.classList.replace("far", "fas");
    titleFav.replace("", "Ajouter aux favoris");
  } else {
    axios
      .post("/remove-favorite", { event: e.target.dataset.evtId })
      .then((modifiedUser) => console.log(modifiedUser))
      .catch((err) => console.log(err));
    e.target.classList.replace("fas", "far");
    titleFav.replace("Ajouter aux favoris", "Retirer des favoris");
  }
  console.log(e.target.dataset.evtId);
}

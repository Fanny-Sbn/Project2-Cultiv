mapboxgl.accessToken =
  "pk.eyJ1IjoiZmFubnlzYm4iLCJhIjoiY2tjajUxMmRsMWk3cTJzcGJmeWU2dWVxeiJ9.pe-D3UmYaICaW4Cw7BNwMg";
var map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v11",
  center: [2.351027, 48.856669], //   [longitude,latitude]
  zoom: 11,
});

//Load map with events
map.addControl(new mapboxgl.NavigationControl(), 'bottom-right').addControl(
  new mapboxgl.GeolocateControl({
    positionOptions: {
      enableHighAccuracy: true,
    },
    trackUserLocation: true,
  }),
  'bottom-right'
);

function getAllItems(query = "") {
  axios
    .get(`https://opendata.paris.fr/api/records/1.0/search/?dataset=que-faire-a-paris-&q=&rows=300${query}`)
    .then((res) => {
      let newArray = [];
      const response = res.data.records.forEach((event) => {
        if (event.geometry != undefined || event.geometry != null) {
          if (event.fields.address_city == "Paris") {
            newArray.push(event);
          }
        }
      });
      const items = newArray.map((event) => {
        return {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [
              event.geometry.coordinates[0],
              event.geometry.coordinates[1],
            ],
          },
          properties: {
            eventID: event.fields.id,
          },
        };
      })
      loadAllItems(items);
    })
    .catch((err) => console.log(err));
}

function loadAllItems(items) {
  items.forEach((marker) => {
    const marker__container = document.createElement('div');
    marker__container.className = 'marker';

    new mapboxgl.Marker(marker__container)
      .setLngLat(marker.geometry.coordinates)
      .addTo(map);
  });
}

let status = {
  gratuit: false,
  arrondissement: [],
  now: true,
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
  getAllItems(query);
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
    let isNow = moment(now).isBetween(h0, h1);
    if (isNow) u = true;
    //if (u == true) console.log(now, h[0], h[1], u);
  });
  return u;
}
function myFunction(query = "") {
  const res = axios
    .get(
      `https://opendata.paris.fr/api/records/1.0/search/?dataset=que-faire-a-paris-&q=&rows=300${query}`
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
    
        return modifiedEvent;
      });
      let allTitles = [];
      const events_pre = finalArr.forEach((event) => {
        if (
          (event.address_city == "Paris" && event.title != undefined) ||
          event.title != null
        ) {
          if(status.now){
            if(event.isNow){
              allTitles.push(event.title);
            }
          }else{
            allTitles.push(event.title);
          }
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
    console.log(status.arrondissement);
    checkStatus();
  })
);



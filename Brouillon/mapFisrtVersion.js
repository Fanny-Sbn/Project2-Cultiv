mapboxgl.accessToken =
    "pk.eyJ1IjoiZmFubnlzYm4iLCJhIjoiY2tjajUxMmRsMWk3cTJzcGJmeWU2dWVxeiJ9.pe-D3UmYaICaW4Cw7BNwMg";
var map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v11",
    center: [2.351027, 48.856669], //   [longitude,latitude]
    zoom: 11,
});

//Fetch events from API

//Load map with events
function loadMap(events) {
    map.on("load", function () {

        axios
            .get(
                `https://opendata.paris.fr/api/records/1.0/search/?dataset=que-faire-a-paris-&q=&rows=2000`
            )
            .then((res) => {
                let newArray = [];
                const events_pre = res.data.records.forEach((event) => {
                    if (event.geometry != undefined || event.geometry != null) {
                        if (event.fields.address_city == "Paris") {
                            newArray.push(event);
                        }
                    }
                });
                const events = newArray.map((event) => {
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
                            icon: "shop",
                        },
                    };
                });
                map.addLayer({
                    id: "points",
                    type: "symbol",
                    source: {
                        type: "geojson",
                        data: {
                            type: "FeatureCollection",
                            features: events,
                        },
                    },
                    layout: {
                        "icon-image": "{icon}-15",
                        "icon-size": 1.5,
                    },
                });
            })
            .catch((err) => {
                console.log(err);
            });
    });
}
loadMap();


const itemInfo = document.querySelector('.info-card__container');

/* marker__container.addEventListener('click', () => {
      itemInfo.style.visibility = 'visible';
      itemInfo.innerHTML = `
      <a class="closeLink">Close</a>
      <h2 class='info-card__title'>${marker.properties.eventID}</h2>
        `;
      document.querySelector('.closeLink').addEventListener('click', () => {
        itemInfo.style.visibility = 'hidden';
      });
      document
        .querySelector('.mapboxgl-canvas')
        .addEventListener('click', () => {
          itemInfo.style.visibility = 'hidden';
        });
    });*/
mapboxgl.accessToken =
  "pk.eyJ1IjoiZmFubnlzYm4iLCJhIjoiY2tjajUxMmRsMWk3cTJzcGJmeWU2dWVxeiJ9.pe-D3UmYaICaW4Cw7BNwMg";
var map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v11",
  center: [2.351027, 48.856669], //   [longitude,latitude]
  zoom: 11,
});

//Fetch events from API
async function getEvents() {
  /*  const res = await axios.get("https://opendata.paris.fr/api/records/1.0/search/?dataset=que-faire-a-paris-&rows=0")
        .then((res) => {
            return res.data.nhits;
        })
        .catch((err) => {
            console.log(err)
        }) 
        .then((nhits) => {*/
  //   axios
  //     .get(
  //       `https://opendata.paris.fr/api/records/1.0/search/?dataset=que-faire-a-paris-&q=&rows=2000`
  //     )
  //     .then((res) => {
  //       //   console.log(res.data);
  //       //   console.log(res.data.records[0].geometry.coordinates);
  //     const events = res.data.records.map((event) => {
  //       if (event.geometry != undefined || event.geometry != null) {
  //         //   console.log(event.geometry.coordinates);
  //         return {
  //           type: "Feature",
  //           geometry: {
  //             type: "Point",
  //             coordinates: [
  //               event.geometry.coordinates[0],
  //               event.geometry.coordinates[1],
  //             ],
  //           },
  //           properties: {
  //             eventID: event.fields.id,
  //             icon: "shop",
  //           },
  //         };
  //       } else {
  //         continue;
  //       }
  //     });
  //     console.log(events);
  //     loadMap(events);
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
  //   //});
  // }

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
      loadMap(events);
    })
    .catch((err) => {
      console.log(err);
    });
}

//Load map with events

function loadMap(events) {
  map.on("load", function () {
    map.addLayer({
      id: "points",
      type: "symbol",
      source: {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: events,
          /* features: [
                        {
                            type: 'Feature',
                            geometry: {
                                type: 'Point',
                                coordinates: [2.351027, 48.856669]
                            },
                            properties:{
                                icon:'shop'
                            }
                        }
                    ] */
        },
      },
      layout: {
        "icon-image": "{icon}-15",
        "icon-size": 1.5,
      },
    });
  });
}

getEvents();

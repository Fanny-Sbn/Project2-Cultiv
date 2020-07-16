mapboxgl.accessToken =
  "pk.eyJ1IjoiZmFubnlzYm4iLCJhIjoiY2tjajUxMmRsMWk3cTJzcGJmeWU2dWVxeiJ9.pe-D3UmYaICaW4Cw7BNwMg";

var bounds = [
  [2.216371, 48.801412], // Southwest coordinates
  [2.444264, 48.923045] // Northeast coordinates
];

var map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v11",
  center: [2.351027, 48.855000],//   [longitude,latitude]
  zoom: 6,
  maxBounds: bounds,
});

//Load map with events
map.addControl(new mapboxgl.NavigationControl(), "bottom-right").addControl(
  new mapboxgl.GeolocateControl({
    positionOptions: {
      enableHighAccuracy: true,
    },
    trackUserLocation: true,
  }),
  "bottom-right"
);


export function loadAllItems(items) {
  let allPreviousMarkers = document.querySelectorAll(".marker");
  allPreviousMarkers.forEach((marker) => marker.remove());
  var bounds = new mapboxgl.LngLatBounds();
  items.forEach((marker) => {
    const marker_content = document.createElement("div");
    marker_content.className = "marker";

    bounds.extend(marker.geometry.coordinates);
    map.fitBounds(bounds, { padding: 50 });

    new mapboxgl.Marker(marker_content)
      .setLngLat(marker.geometry.coordinates)
      .setPopup(
        new mapboxgl.Popup({ offset: 25 }) // add popups
          .setHTML(
            `<img class="img-popup" src="${marker.properties.img}">` +
              "<br>" +
              `<a href ="/evenement/${marker.properties.id}">` +
              marker.properties.title +
              "</a>" +
              "<br>" +
              `<img data-evt-id="${marker.properties.id}" class="img-fav" src="../img/1.png">` +
              "<br>" +
              "<p>" +
              marker.properties.place +
              "</p>" +
              "<br>" +
              "<p>" +
              marker.properties.dateDescription +
              "</p>"
          )
      )
      .addTo(map);

    //console.log(marker.properties.title);
  });
  //enlever le loader
}

//e.target.dataset.evtId

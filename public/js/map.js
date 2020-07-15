mapboxgl.accessToken =
  "pk.eyJ1IjoiZmFubnlzYm4iLCJhIjoiY2tjajUxMmRsMWk3cTJzcGJmeWU2dWVxeiJ9.pe-D3UmYaICaW4Cw7BNwMg";
var map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v11",
  center: [2.351027, 48.856669], //   [longitude,latitude]
  zoom: 11,
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
  console.log(items);
  let allPreviousMarkers = document.querySelectorAll(".marker");
  allPreviousMarkers.forEach((marker) => marker.remove());
  items.forEach((marker) => {
    const marker__container = document.createElement("div");
    marker__container.className = "marker";
    new mapboxgl.Marker(marker__container)
      .setLngLat(marker.geometry.coordinates)
      .addTo(map);
  });
}




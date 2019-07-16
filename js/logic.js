// Creating map object
var map = L.map("map", {
  center: [39.9612, -82.9988],
  zoom: 7
});


var link = "https://opendata.arcgis.com/datasets/7212b60cc5fc4949869995813628182c_12.geojson";

// Grabbing our GeoJSON data..
d3.json(link, function(data) {
  // Creating a GeoJSON layer with the retrieved data
  L.geoJson(data).addTo(map);
});

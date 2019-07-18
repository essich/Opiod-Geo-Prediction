// Creating predicted map object
var p_map = L.map("map1", {
  center: [39.9612, -82.9988],
  zoom: 7
});

// Adding layer
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
}).addTo(p_map);

var link = "https://opendata.arcgis.com/datasets/7212b60cc5fc4949869995813628182c_12.geojson";

function predictColor(risk_level) {
  risk_level = risk_level.properties.COUNTY_CD
  switch (risk_level) {
  case "CUY":
    return "red";
  case "medium":
    return "yellow";
  case "low":
    return "green";
  default:
    return "yellow";
  }
}

function actualColor(risk_level) {
  risk_level = risk_level.properties.COUNTY_CD
  switch (risk_level) {
  case "SUM":
    return "red";
  case "medium":
    return "yellow";
  case "low":
    return "green";
  default:
    return "green";
  }
}

// Grabbing our GeoJSON data..
d3.json(link, function(data) {
  // Creating a GeoJSON layer with the retrieved data
  L.geoJson(data, {
    style: function(feature) {
      return {
        fillColor: predictColor(feature),
        color: "blue",
        fillOpacity: 0.3,
        weight: 1.5
      };
    },
    onEachFeature: function(feature, layer) {
      layer.on({
        mouseover: function(event) {
          var countyName = feature.properties.COUNTY_CD;
          layer = event.target;
          layer.bindTooltip("County: " + countyName);
          layer.setStyle({
            fillOpacity: 2
          })
        },
        mouseout: function(event) {
          layer = event.target;
          layer.setStyle({
            fillOpacity: 0.3
          })
        }
      })
    }
  }).addTo(p_map);
});

// Creating actual map object
var a_map = L.map("map2", {
  center: [39.9612, -82.9988],
  zoom: 7
});

// Adding layer
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
}).addTo(a_map);

// Grabbing our GeoJSON data..
d3.json(link, function(data) {
  // Creating a GeoJSON layer with the retrieved data
  L.geoJson(data, {
    style: function(feature) {
      return {
        fillColor: actualColor(feature),
        color: "blue",
        fillOpacity: 0.3,
        weight: 1.5
      };
    },
    onEachFeature: function(feature, layer) {
      layer.on({
        mouseover: function(event) {
          var countyName = feature.properties.COUNTY_CD;
          layer = event.target;
          layer.bindTooltip("County: " + countyName);
          layer.setStyle({
            fillOpacity: 2
          })
        },
        mouseout: function(event) {
          layer = event.target;
          layer.setStyle({
            fillOpacity: 0.3
          })
        }
      })
    }
  }).addTo(a_map);
});
// Create tile layer
var backmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {

  maxZoom: 18,
  id: "mapbox.light",
  accessToken: API_KEY
});

// Creating predicted map object
var p_map = L.map("map1", {
  center: [40.15,  -82.7],
  zoom: 7

});

//Legend code
var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = ["High Risk", "Medium Risk", "Low Risk"],
        labels = ["Resources/high.png", "Resources/med.png","Resources/low.png"];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            "<b>" + grades[i] + "</b>" + (" <img src=" + labels[i] +" height='20' width='20'>") +'<br><br>';
    }

    return div;
};

legend.addTo(p_map);
//end legend code

backmap.addTo(p_map);

var jsonLink = "https://opendata.arcgis.com/datasets/838263e7e9bb469c966006a2bbe15bf7_0.geojson";

// Grab a reference to the dropdown select element
var selector = d3.select("#selDataset");
var years = [2014, 2015, 2016, 2017, 2020];
var flag = 0;

// Populate the select options
years.forEach((year) => {
  selector
    .append("option")
    .text(year)
    .property("value");
});

function optionChanged(year) {
  getJSON(year);
}

function predictColor(county_code, info, year) {
  for (var i = 0; i < info.length; i++) {
    if (info[i].county_abb == county_code && info[i].year == year) {
      var risk = info[i].risk;
    }
  }
  switch (risk) {
  case ("high"):
    return "rgb(164, 30, 33)";
  case ("low"):
    return "rgb(250, 200, 205)";
  case ("medium"):
    return "rgb(221, 127, 124)";
  default:
    return "grey";
  }
}

function buildTable(data, json, countyCode, year) {
  var dataArray = [{
    Header:"County name:",
    Value:""
  },
  {
    Header:"Opioid Crisis Risk level:",
    Value:""
  },
  {
    Header:"Opioid scripts/100k persons:",
    Value:""
  },
  {
    Header:"Violent Crime/100k persons:",
    Value:""
  },
  {
    Header:"Property Crime/100k persons:",
    Value: ""
  },
  {
    Header:"Theft/100k persons",
    Value:""
  },
  {
    Header:"Under 18 poverty rate",
    Value:""
  },
  {
    Header:"Year:",
    Value:""
  }];

  for (var i = 0; i < data.length; i++) {
    if (data[i].county_abb == countyCode && data[i].year == year) {
      //Store metadata into appropriate dictionary
      dataArray[0].Value = data[i].county_name;
      dataArray[1].Value = data[i].risk;
      dataArray[2].Value = data[i].opioid_scripts.toFixed(2);
      dataArray[3].Value = data[i].crime_violent.toFixed(2);
      dataArray[4].Value = data[i].crime_property.toFixed(2);
      dataArray[5].Value = data[i].crime_theft.toFixed(2);
      dataArray[6].Value = data[i].under_18_poverty.toFixed(2) + "%";
      dataArray[7].Value = year;
    }
  }

    //Build lable on HTML page
    d3.select("tbody")
      .html("")
      .selectAll("td")
      .data(dataArray)
      .enter()
      .append("tr")
      .html(function(d) {
        return `<td>${d.Header}</td><td>${d.Value}</td>`;
    })
}

function getJSON(yearSelected) {
  if (flag == 0) {
    yearSelected = 2014;
    flag = 1;
  }
// Grabbing our GeoJSON data..
d3.json(jsonLink, function(data) {
  d3.json("js/data.json", function(countyData) {
  tableData = countyData;
  L.geoJson(data, {
      style: function(feature) {
        return {
          fillColor: predictColor(feature.properties.ABBREV, countyData, yearSelected),
          color: "white",
          fillOpacity: 100,
          weight: 1
        };
      },
    onEachFeature: function(feature, layer) {
      layer.on({
        mouseover: function() {
          buildTable(tableData, feature, feature.properties.ABBREV, yearSelected);
        },
      })
    }
  }).addTo(p_map);
});
});
}

getJSON(selector);

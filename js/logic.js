// Create tile layer
var backmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
});

// Creating predicted map object
var p_map = L.map("map1", {
  center: [40.1,  -82.7],
  zoom: 7
});

backmap.addTo(p_map);

var jsonLink = "https://opendata.arcgis.com/datasets/7212b60cc5fc4949869995813628182c_12.geojson";

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
    return "rgb(255, 0, 0)";
  case ("low"):
    return "rgb(238, 70, 70)";
  case ("medium"):
    return "rgb(255, 207, 207)";
  default:
    return "grey";
  }
}

function buildTable(data, json, countyCode, year) {
  console.log("Year: ", year);
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
    Header:"Poverty/100k persons",
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
      dataArray[2].Value = data[i].opioid_scripts;
      dataArray[3].Value = data[i].crime_violent;
      dataArray[4].Value = data[i].crime_property;
      dataArray[5].Value = data[i].crime_theft;
      dataArray[6].Value = data[i].under_18_poverty;
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
          fillColor: predictColor(feature.properties.COUNTY_CD, countyData, yearSelected),
          color: "white",
          fillOpacity: 100,
          weight: 1
        };
      },
    onEachFeature: function(feature, layer) {
      layer.on({
        mouseover: function() {
          var countyName = feature.properties.COUNTY_CD;
          layer.bindTooltip("County: " + countyName);
          layer.setStyle({
            fillOpacity: 100,
            weight: 3
          });
          buildTable(tableData, feature, feature.properties.COUNTY_CD, yearSelected);
        },
        mouseout: function(event) {
          layer = event.target;
          layer.setStyle({
            fillOpacity: 100,
            weight: 1
          })
        }
      })
    }
  }).addTo(p_map);
});
});
}

getJSON(selector);

// Submit Button handler
function handleSubmit() {
  // Prevent the page from refreshing
  d3.event.preventDefault();

d3.json('resources/graph.json').then(function (masterData) {
  console.log(masterData);
  console.log(masterData.columns);
  var years = [2014, 2015, 2016,2017];


  // Select the input value from the form
  var county = d3.select("#countyInput").node().value;
  console.log(county);
 // Select the input value from the form
 var metric = d3.select("#metricInput").node().value;
 console.log(metric);

  // Build the plot with the new stock
  // buildPlot(county,metric);

  var trace1 = {
    x: years,
    y: masterData[county][metric],
    type: 'bar',
    
  };
  // var trace2 = {
  //   x: countyData.YEAR,
  //   y: countyData.CRIME_THEFT_100k,
  //   type: 'scatter',
  //   mode: 'lines'
  // };
  var layout = {
    title: county +" - "   + metric,
    xaxis: {
      autotick: false,
      ticks: 'outside',
      tick0: 0,
      dtick: 0.0,
      ticklen: 8,
      tickwidth: 1,
      // tickcolor: '#000'
    }
  };
  var data = [trace1];
  
  Plotly.newPlot("plot", data,layout);
});
};
// Add event listener for submit button
d3.select("#submit").on("click", handleSubmit);


  // Grab values from the response json object to build the plots

  // var trace1 = {
  //   type: "scatter",
  //   mode: "lines",
  //   name: county,
  //   x: year,
  //   y: scripts,
  //   line: {
  //     color: "#17BECF"
  //   }
  // };
  // var trace2 = {
  //   type: "scatter",
  //   mode: "lines",
  //   name: stock2,
  //   x: dates2,
  //   y: closingPrices2,
  //   line: {
  //     color: "#ffa500"
  //   }
  // };
  // var trace3 = {
  //   type: "scatter",
  //   mode: "markers",
  //   marker: { size: 14 },
  //   text: carrierTool,
  //   text: tooltip,
  //   name: "Crash",
  //   x: datesToPlot,
  //   y: deaths,
  //   line: {
  //     color: "#ff0000"
  //   }
  // };
  // var data = [trace1, trace2, trace3];

  // var layout = {
  //   title: stock + " Vs " + stock2,
  //   xaxis: {
  //     autorange: true,
  //     range: ['2015-02-17', '2017-02-16'],
  //     rangeselector: {
  //       buttons: [
  //         {
  //           count: 1,
  //           label: '1m',
  //           step: 'month',
  //           stepmode: 'backward'
  //         },
  //         {
  //           count: 6,
  //           label: '6m',
  //           step: 'month',
  //           stepmode: 'backward'
  //         },
  //         { step: 'all' }
  //       ]
  //     },
  //     rangeslider: { range: ['2015-02-17', '2017-02-16'] },
  //     type: 'date'
  //   },
  //   yaxis: {
  //     autorange: true,
  //     range: [86.8700008333, 138.870004167],
  //     type: 'linear'
  //   }
  // };

  // var trace1 = {
  //   x: years,
  //   y: masterData['ADAMS COUNTY']['CRIME_THEFT_100k'],
  //   type: 'scatter',
  //   mode: 'lines+markers'
    
  // };

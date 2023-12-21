// Creating the map object
let myMap = L.map("map", {
    center: [ 34.0549, -118.2426],
    zoom: 7
  });
  
  // Adding the tile layer
  L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYXJpZWxnYW1pbm8iLCJhIjoiY2t5ZjRmaGV2MGY4ejJvcGxhaXpmeGRuaiJ9.y5NFodPtNK_FHZekxtrCUQ', {
       attribution: '© <a href="https://www.mapbox.com/feedback/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
       tileSize: 512,
       zoomOffset: -1
}).addTo(myMap);


// Read the geojson file containing the earthquakes from past 7 days
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then((data) => {
  
    // Print on the console
    console.log(data.features);

    // Function to calculate the marker size based on magnitude of the earthquake
    function markersize(magnitude){
        return magnitude*5000;
    }
  
    // Function to return marker color based on the depth
    function markerColor(depth){
    if (depth <= 10) return "#00FF00";
    else if (depth <= 30) return "greenyellow";
    else if (depth <= 50) return "yellow";
    else if (depth <= 70) return "orange";
    else if (depth <= 90) return "orangered";
    else return "#FF0000";
    }

    // Add markers to each co-ordinate in the earthquake data
    data.features.forEach((record) => {

       let marker = L.circle([record.geometry.coordinates[1],record.geometry.coordinates[0]],{
        stroke: true,
        fillOpacity: 0.75,
        color: '#000',
        weight : 1,
        opacity : 0.75,
        fillColor: markerColor(record.geometry.coordinates[2]),
        radius : markersize(record.properties.mag),
       // Adding popup to provide additional information on the earthquake like location, magnitude and depth
       }).bindPopup("<h3>Location: " + record.properties.place + "<h3><h3>Magnitude: " + record.properties.mag + "<h3><h3>Depth: " + record.geometry.coordinates[2] + "</h3>").addTo(myMap);


    })

  // Adding a legend
  const legend = L.control({ position: 'bottomright' });
  legend.onAdd = function () {
    const div = L.DomUtil.create('div', 'info legend');
    // Depth range
    const depthRanges = [-10, 10, 30, 50, 70, 90];
    const labels = [];
  
    // Loop through the depth intervals and generate a label with a colored square for each interval
    for (let i = 0; i < depthRanges.length; i++) {
      div.innerHTML +=
        '<i style="background:' +
        markerColor(depthRanges[i] + 5) +
        '"></i> ' +
        depthRanges[i] +
        (i < depthRanges.length - 1 ? '&ndash;' + (depthRanges[i + 1]) + '<br>' : '+');
    }
  
    return div;
  };
  
  // Add the legend to the map
  legend.addTo(myMap);



  });

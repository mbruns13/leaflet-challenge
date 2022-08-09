// Using Leaflet, create a map that plots all the earthquakes from your dataset based on their longitude and latitude.
// Your data markers should reflect the magnitude of the earthquake by their size and the depth of the earthquake by color. Earthquakes with higher magnitudes should appear larger, and earthquakes with greater depth should appear darker in color.
// Hint: The depth of the earth can be found as the third coordinate for each earthquake.
// Include popups that provide additional information about the earthquake when its associated marker is clicked.
// Create a legend that will provide context for your map data.



// Load the GeoJSON data.
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Get the data with d3
d3.json(url).then(function(data) {

    console.log(data);

    // var color = "";

    // for (var i = 0; i < data.features.length; i++) {
    //     var depth = data.features[i].geometry.coordinates[2];
    //     var magnitude = data.features[i].properties.mag;

    //     if (depth < 10) {
    //         color = "#a3f600";
    //     } else if (depth < 30) {
    //         color = "#dcf400";
    //     } else if (depth < 50) {
    //         color = "#f7db11";
    //     } else if (depth < 70) {
    //         color = "#fdb72a";
    //     } else if (depth < 90) {
    //         color = "#fca35e";
    //     } else {
    //         color = "#ff5f65";
    //     };


    //     // add circles to the map
    //     var geojsonMarkerOptions = {
    //         radius: Math.sqrt(magnitude) * 6,
    //         fillColor: color,
    //         color: "#000",
    //         weight: 1,
    //         opacity: 2,
    //         fillOpacity: 0.8
    //     };

    // }
    createFeatures(data.features);

});

function createFeatures(earthquakeData) {


    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]}</p>`);

    }

    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng, {
                radius: parseFloat(feature.geometry.coordinates[2]),
                fillColor: "blue",
                color: "#000",
                weight: 1,
                opacity: 2,
                fillOpacity: 0.8
            });
        }
    });

    createMap(earthquakes);
}

function createMap(earthquakes) {

    // Create the base layers.
    var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })

    var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });

    // Create a baseMaps object.
    var baseMaps = {
        "Street Map": street,
        "Topographic Map": topo
    };

    // Create an overlay object to hold our overlay.
    var overlayMaps = {
        Earthquakes: earthquakes
    };

    // Create our map, giving it the streetmap and earthquakes layers to display on load.
    var myMap = L.map("map", {
        center: [
            37.09, -95.71
        ],
        zoom: 5,
        layers: [street, earthquakes]
    });

    // Create a layer control.
    // Pass it our baseMaps and overlayMaps.
    // Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

}
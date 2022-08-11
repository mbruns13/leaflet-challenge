// Using Leaflet, create a map that plots all the earthquakes from your dataset based on their longitude and latitude.
// Your data markers should reflect the magnitude of the earthquake by their size and the depth of the earthquake by color. Earthquakes with higher magnitudes should appear larger, and earthquakes with greater depth should appear darker in color.
// Hint: The depth of the earth can be found as the third coordinate for each earthquake.
// Include popups that provide additional information about the earthquake when its associated marker is clicked.
// Create a legend that will provide context for your map data.

var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
var colorsArray = ["#a3f600", "#dcf400", "#f7db11", "#fdb72a", "#fca35e", "#ff5f65"];
var geojson;


function createMap(earthquakes) {
    // Create the tile layer that will be the background of our map.
    var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
    var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });

    // Create a baseMaps object to hold the lightmap layer.
    var baseMaps = {
        "Street Map": street,
        "Topographic Map": topo
    };

    // Create an overlayMaps object to hold the earthquakes layer.
    var overlayMaps = {
        "Earthquakes": earthquakes
    };
    // Create the map object with options.
    var myMap = L.map("map", {
        center: [37.09, -95.71],
        zoom: 4,
        layers: [street, earthquakes]
    });

    // Create a layer control, and pass it baseMaps and overlayMaps. Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

    // Legend for map - used this site: https://codepen.io/haakseth/pen/KQbjdO
    var legend = L.control({ position: 'bottomright' });

    legend.onAdd = function(map) {
        var div = L.DomUtil.create("div", "legend");
        div.innerHTML += '<i style="background: #a3f600"></i><span>-10-10</span><br>';
        div.innerHTML += '<i style="background: #dcf400"></i><span>10-30</span><br>';
        div.innerHTML += '<i style="background: #f7db11"></i><span>30-50</span><br>';
        div.innerHTML += '<i style="background: #fdb72a"></i><span>50-70</span><br>';
        div.innerHTML += '<i style="background: #fca35e"></i><span>70-90</span><br>';
        div.innerHTML += '<i style="background: #ff5f65"></i><span>90+</span><br>';

        return div;
    };

    legend.addTo(myMap);


};

function createMarkers(data) {
    var earthquakeFeatures = data.features;
    var earthquakeMarkers = [];

    // function to determine color based on depth of earthquake
    function color(depth) {
        var depthColor = "";
        if (depth < 10) {
            depthColor = colorsArray[0];
        } else if (depth < 30) {
            depthColor = colorsArray[1];
        } else if (depth < 50) {
            depthColor = colorsArray[2];
        } else if (depth < 70) {
            depthColor = colorsArray[3];
        } else if (depth < 90) {
            depthColor = colorsArray[4];
        } else {
            depthColor = colorsArray[5];
        };
        return depthColor;
    }

    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]}</p>`);
    }

    // Create a GeoJSON layer that contains the features array on the earthquakeData object.
    // Run the onEachFeature function once for each piece of data in the array.
    var earthquakes = L.geoJSON(earthquakeFeatures, {
        onEachFeature: onEachFeature,
        //in addition to adding pop-up info on each marker, the code below edits each marker depending on each earthquake's magnitude and depth
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng, {
                radius: parseFloat(feature.properties.mag) * 5,
                fillColor: color(feature.geometry.coordinates[2]),
                color: "#000",
                weight: 1,
                opacity: 2,
                fillOpacity: 0.8
            });
        }
    });


    //instead of oneachfeature I tried using a loop like in the citi bike activity, but I couldn't get markers to show up even though there were no errors in the console :(
    // for (var i = 0; i < earthquakeFeatures.length; i++) {
    //     var lat = parseFloat(earthquakeFeatures[i].geometry.coordinates[0]);
    //     var lon = parseFloat(earthquakeFeatures[i].geometry.coordinates[1]);
    //     var depth = parseFloat(earthquakeFeatures[i].geometry.coordinates[2]);
    //     var mag = parseFloat(earthquakeFeatures[i].properties.mag);

    //     var depthColor = "";

    //     if (depth < 10) {
    //         depthColor = colorsArray[0];
    //     } else if (depth < 30) {
    //         depthColor = colorsArray[1];
    //     } else if (depth < 50) {
    //         depthColor = colorsArray[2];
    //     } else if (depth < 70) {
    //         depthColor = colorsArray[3];
    //     } else if (depth < 90) {
    //         depthColor = colorsArray[4];
    //     } else {
    //         depthColor = colorsArray[5];
    //     };

    //     var newMarker = L.marker([lat, lon], {
    //         radius: (mag * 10),
    //         // color: "#000",
    //         fillColor: depthColor,
    //         weight: 1,
    //         opacity: 2,
    //         fillOpacity: 0.8
    //     }).bindPopup(`<h3>${earthquakeFeatures[i].properties.place}</h3><hr><p>${new Date(earthquakeFeatures[i].properties.time)}</p><p>Magnitude: ${mag}</p><p>Depth: ${depth}</p>`);

    //     earthquakeMarkers.push(newMarker);
    // };
    // // var earthquakes = L.layerGroup(earthquakeMarkers);
    // console.log(L.layerGroup(earthquakeMarkers))

    // createMap(L.layerGroup(earthquakeMarkers));

    createMap(earthquakes)
};

d3.json(url).then(function(data) {
    // console.log(data.features);
    // console.log(data.features[0])

    createMarkers(data);

});
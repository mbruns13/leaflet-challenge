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

    // from https://stackoverflow.com/questions/9394190/leaflet-map-api-with-google-satellite-layer
    var satellite = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    });


    // Create a baseMaps object to hold the lightmap layer.
    var baseMaps = {
        "Street Map": street,
        "Topographic Map": topo,
        "Satellite": satellite
    };

    // Create an overlayMaps object to hold the earthquakes layer.
    var overlayMaps = {
        "Earthquakes": earthquakes,
    };
    // Create the map object with options.
    var myMap = L.map("map", {
        center: [37.09, -95.71],
        zoom: 4,
        layers: [satellite, earthquakes]
    });

    // Create a layer control, and pass it baseMaps and overlayMaps. Add the layer control to the map.
    var layerControl = L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    });

    // add in tectonic plate lines/polygons
    // used code from this video: https://www.youtube.com/watch?v=X3YsvoHqQGQ
    // and this page: https://leafletjs.com/examples/layers-control/
    fetch("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json").then(function(response) {
        return response.json()
    }).then(function(data) {
        console.log(data)
        layerControl.addOverlay(L.geoJSON(data, {
                style: {
                    color: "orange",
                    fillColor: "none",
                    weight: 1
                }
            }), "Tectonic Plates")
            // tectonic = L.layerGroup(tectonic_data)

    });
    layerControl.addTo(myMap);


    // Legend for map - used this site: https://codepen.io/haakseth/pen/KQbjdO
    var legend = L.control({ position: 'bottomright' });

    legend.onAdd = function(map) {
        var div = L.DomUtil.create("div", "legend");
        div.innerHTML += "<h4>Earthquake Depth</h4>";
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
                radius: parseFloat(feature.properties.mag) * 4,
                fillColor: color(feature.geometry.coordinates[2]),
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.9
            });
        }
    });

    createMap(earthquakes)
};

d3.json(url).then(function(data) {
    // console.log(data.features);
    // console.log(data.features[0])

    createMarkers(data);

});
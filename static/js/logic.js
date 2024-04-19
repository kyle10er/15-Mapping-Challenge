// Create the map object with specified center and zoom level.
let myMap = L.map("map", {
    center: [38.8206673, -122.8141632],
    zoom: 3, 
});
let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

let geoData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Load GEOJSON data with d3
d3.json(geoData).then(function (data) {

    L.geoJson(data, {
        pointToLayer: function(feature, coordinates){ 
            return L.circleMarker(coordinates, {    
                radius: markerSize(feature.properties.mag),
                fillColor: markerColor(feature.geometry.coordinates[2]),
                color: "black",
                weight: 0.5,
                fillOpacity: 0.5
            });
        },
        onEachFeature: function(feature, layer){
            layer.bindPopup(`<h3>${feature.properties.title}</h3><hr>
            <p><strong>Magnitude:</strong> ${feature.properties.mag}</p>
            <p><strong>Depth:</strong> ${feature.geometry.coordinates[2]} km</p>`);
        }
    }).addTo(myMap);

    let legend = L.control({position: "bottomright"});

    legend.onAdd = function() {
        let div = L.DomUtil.create("div", "info legend");
        div.innerHTML = "<h4>Earthquake Depth [km]</h4>";
        let labels = ["< 10", "10-30", "30-50", "50-70", "70-90", "90+"];
        let colors = ["lime", "greenyellow", "yellow", "orange", "darkorange", "red"];
        
        for (let i = 0; i < labels.length; i++){
            div.innerHTML += `<i style=\"background:${colors[i]}"></i>${labels[i]}<br>`;
        }
        return div;
    };
    // Add the legend to the map
    legend.addTo(myMap);
});

//functions used to change the marker to indicate the different earthquakes
function markerSize(magnitude) {
    return magnitude * 2;
}

function markerColor(depth) {
    if (depth >= 90)return "red";
    else if (depth >= 70) return "darkorange";
    else if (depth >= 50) return "orange";
    else if (depth >= 30) return "yellow";
    else if (depth >= 10) return "green";
    else return "blue";
}


var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

d3.json(queryUrl, function(data) {
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place + " ---  MAG:" + feature.properties.mag +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  }


  function geojsonMarkerOptions(feature) {
    function fillcolor(feature){
      var mag = feature.properties.mag
      if (mag >= 5 ){
        return '#ea2c2c';
      }else if (mag >= 4){
        return '#ea822c';
      }else if (mag >= 3){
        return '#ee9c00';
      }else if (mag >= 2 ){
        return '#eecc00';
      }else if (mag >= 1 ){
        return '#d4ee00';
      }else{
        return '#98ee00';
      }}
  return {  radius: feature.properties.mag * 5,
    fillColor: fillcolor(feature), 
    color: 'black',
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
  }
};

  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    style: geojsonMarkerOptions,
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng);
    }
  });

  createMap(earthquakes);
}

// L.geoJson(sites, {
//   pointToLayer: function (feature, latlng) {
//       return L.circleMarker(latlng, geojsonMarkerOptions);
//   },
//   onEachFeature: siteslabels
// }).addTo(map);

function createMap(earthquakes) {

  var lightmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

  var baseMaps = {
    "Light Map": lightmap,
    "Dark Map": darkmap
  };

  var overlayMaps = {
    Earthquakes: earthquakes
  };

  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [lightmap, earthquakes]
  });

  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}

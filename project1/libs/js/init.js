// Initialize Map
var mymap = L.map('mapid', {
    zoomControl: false,
    minZoom: 2,
    maxBounds: L.latLngBounds( L.latLng(-89.98155760646617, -180) , L.latLng(89.99346179538875, 180) ),
    maxBoundsViscosity: 1.0
}).setView([51.505, -0.09], 5);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibW9lc2FtYWhkaSIsImEiOiJja3RtMHlzamkwY3YzMm5vNWpiNnBsNjdpIn0.JBET1TFYKkqYnMCOU6ZpHQ', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1
}).addTo(mymap);

L.control.zoom({
    position: 'topright'
}).addTo(mymap);

// Populate search datalist with country names
$.ajax({
    url: "libs/php/setup/getCountryNames.php",
    method: 'GET',
    dataType: 'json',
    success: (data) => {        
        data.forEach(country => {
            $('#countries').append("<option value='" + country + "'>");
        });
    },
    error: () => {
        console.log('Error requesting geoJSON data');
    }
});
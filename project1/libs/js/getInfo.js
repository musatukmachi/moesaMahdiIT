import { toggleDetails } from "./toggleDetails.js";

// Remove layer
const removeMarkers = () => {
    mymap.eachLayer( (layer) => {
        if ( layer.myTag &&  layer.myTag === "myGeoJSON") {
            mymap.removeLayer(layer)
        }
    });
}

// Run when clicking the search button
$('.fa-search').click(() => {
    var coord;
    var country = $('input').val();
    $('#country-name').text(country);

    toggleDetails();

    removeMarkers();

    $('#details-results').html('');

    // Pan map to selected Country
    $.ajax({
        url: "libs/php/setup/getCountryLocation.php",
        method: 'POST',
        data: {
            country: country.replaceAll(' ', '+')
        },
        success: (result) => {
            coord = [result.data.lat, result.data.lng];
            console.log('country location req: ', result);
            mymap.panTo( new L.LatLng( coord[0] , coord[1] ) );

            // Get Country Time
            $.ajax({
                url: "libs/php/setup/getCountryTime.php",
                method: 'POST',
                data: {
                    coord: '?latitude=' + coord[0].toString() + '&longitude=' + coord[1].toString()
                },
                success: (result) => {
                    console.log('request country time: ', JSON.parse(result));
                    $('#country-time').text(JSON.parse(result).LocalTime_Now);
                },
                error: () => {
                    console.log('Failed to retrieve country time');
                }
            });
        },
        error: () => {
            console.log('Failed to retrieve country location');
        }
    });

    // get Country Borders
    $.ajax({
        url: "libs/php/setup/getCountryBorders.php",
        method: 'POST',
        dataType: 'json',
        data: {
            country: country
        },
        success: (result) => {
            L.geoJSON(result, {
                style: {
                    color: "#aaaaaa",
                    weight: 1,
                    opacity: 0.5
                },
                onEachFeature: (feature, layer) => {
                    layer.myTag = "myGeoJSON"
                }
            }).addTo(mymap);
        },
        error: () => {
            console.log('Failed to retrieve country borders');
        }
    });
});
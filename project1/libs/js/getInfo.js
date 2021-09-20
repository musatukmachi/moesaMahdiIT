// Remove layer
const removeMarkers = () => {
    mymap.eachLayer( (layer) => {
        if ( layer.myTag &&  layer.myTag === "myGeoJSON") {
            mymap.removeLayer(layer)
        }
    });
}

// Run when clicking the search button
$('.fa-search').click(async () => {
    // reset border and details
    removeMarkers();
    $('#details-results').html('');

    var coord;
    // change country name state
    store.name = $('input').val();
    $('#country-name').text(store.name);


    // change country code state
    $.ajax({
        url: "libs/php/setup/getCountryCode.php",
        method: 'POST',
        data: {
            name: $('input').val()
        },
        success: (result) => {
            store.code = result;
            reqDemographicsInfo();
        }
    });

    // Pan map to selected Country
    $.ajax({
        url: "libs/php/setup/getCountryLocation.php",
        method: 'POST',
        data: {
            country: store.name.replaceAll(' ', '+')
        },
        success: (result) => {
            coord = [result.data.lat, result.data.lng];
            store.lat = coord[0];
            store.lng = coord[1];
            console.log('country location req: ', result);
            mymap.panTo( new L.LatLng( coord[0] , coord[1] ) );

            // Get Country Time
            // $.ajax({
            //     url: "libs/php/setup/getCountryTime.php",
            //     method: 'POST',
            //     data: {
            //         coord: '?latitude=' + coord[0].toString() + '&longitude=' + coord[1].toString()
            //     },
            //     success: (result) => {
            //         console.log('request country time: ', JSON.parse(result));
            //         $('#country-time').text(JSON.parse(result).LocalTime_Now);
            //     },
            //     error: () => {
            //         console.log('Failed to retrieve country time');
            //     }
            // });
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
            country: store.name
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

    toggleDetails();
});


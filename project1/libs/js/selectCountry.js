// Run when clicking the search button
$('.fa-search').click(() => {
    let country = $('input').val();

    // get Country Borders
    $.ajax({
        url: "libs/php/getCountryBorders.php",
        method: 'POST',
        dataType: 'json',
        data: {
            country: country
        },
        success: (data) => {
            // window.mymap.removeLayer(window.polygon);
            L.geoJSON(data, {
                style: {
                    color: "#aaaaaa",
                    weight: 1,
                    opacity: 0.5
                }
            }).addTo(mymap);
        },
        error: () => {
            console.log('Failed to retrieve country borders');
        }
    });

    // Pan map to selected Country
    $.ajax({
        url: "libs/php/getCountryLocation.php",
        method: 'POST',
        data: {
            country: country.replaceAll(' ', '+')
        },
        success: (result) => {
            console.log('country location req: ', result);
            mymap.panTo( new L.LatLng( result.data.lat , result.data.lng ) );
        },
        error: () => {
            console.log('Failed to retrieve country location');
        }
    });

    // display details window
    $('#details').show();
    
});
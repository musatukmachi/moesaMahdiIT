$('#apiWiki').click(() => {
    $.ajax({
        url: "libs/php/getWikiInfo.php",
        type: 'POST',
        dataType: 'json',
        data: {
            lang: $('#language').val(),
            country: $('#country').val(),
            postalcode: $('#postalcode').val().replace(' ', ''),
            radius: $('#radius').val()
        },
        success: (result) => {

            console.log(JSON.stringify(result));

            if (result.status.name == "ok") {
                $('#results').html('');
                for (let i = 0;  i < result['data'].length; i++) {
                    $('#results').append(
                        "<p>Summary: " + result['data'][i]['summary']
                        + "</p><p>URL: " + result['data'][i]['wikipediaUrl']
                        + "</p><br/>"
                    );
                }

            }
    
        },
        error: (jqXHR, textStatus, errorThrown) => {
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
            $('#results').html('Can\'t find this postal code.');
        }
    });
});


$('#apiOcean').click(() => {
    $.ajax({
        url: "libs/php/getOceanInfo.php",
        type: 'POST',
        dataType: 'json',
        data: {
            lang: $('#language').val(),
            lat: $('#latitude').val(),
            lng: $('#longitude').val()
        },
        success: (result) => {

            console.log(JSON.stringify(result));

            if (result.status.name == "ok") {
                $('#results').html(result.data.name);
                
            }
    
        },
        error: (jqXHR, textStatus, errorThrown) => {
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
            $('#results').html('Can\'t find an ocean with this latitude and longitude.');
        }
    });
});

$('#apiEarth').click(() => {
    $.ajax({
        url: "libs/php/getEarthquakeInfo.php",
        type: 'POST',
        dataType: 'json',
        data: {
            lang: $('#language').val(),
            north: $('#north').val(),
            south: $('#south').val(),
            east: $('#east').val(),
            west: $('#west').val()
        },
        success: (result) => {

            console.log(JSON.stringify(result));

            if (result.status.name == "ok") {
                if(result.data.length === 0) {
                    $('#results').html('No earthquakes found');
                } else {
                    $('#results').html('');
                    for (let i = 0;  i < result['data'].length; i++) {
                        $('#results').append(
                            "<p>Latitude: " + result['data'][i]['lat']
                            + ", Longitude: " + result['data'][i]['lng']
                            + "</p><p>Magnitude: " + result['data'][i]['magnitude']
                            + "</p><p>Datetime: " + result['data'][i]['datetime']
                            + "</p><br/>"
                        );
                    }
                }
            }
    
        },
        error: (jqXHR, textStatus, errorThrown) => {
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
            $('#results').html('Can\'t find any earthquakes.');
        }
    });
});
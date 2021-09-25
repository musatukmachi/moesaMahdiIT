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

// Remove Border
const removeBorder = () => {
    mymap.eachLayer( (layer) => {
        if ( layer.myTag && layer.myTag === "myGeoJSON") {
            mymap.removeLayer(layer)
        }
    });
}

// Checks for ajax request status to display loader or not
$(document).ajaxStart(() => {
    $(".loading").show();
});

$(document).ajaxStop(() => {
    $(".loading").hide();
});

/// Run on first load ///
// Populate search with country names
$.ajax({
    url: "libs/php/setup/getCountryNames.php",
    method: 'GET',
    dataType: 'json',
    success: (data) => {     
        data.sort();   
        data.forEach(country => {
            $('#searchbar').append("<option value='" + country + "'>" + country + "</option>");
        });
    },
    error: () => {
        console.log('Error requesting geoJSON data');
    }
});

// get Country Borders
$.ajax({
    url: "libs/php/setup/getGeoJSON.php",
    method: 'GET',
    dataType: 'json',
    success: (result) => {
        store.geoJSON = JSON.parse(result);
        $('.loading').css("background-color", "rgb(0,0,0,0)");
    },
    error: () => {
        console.log('Failed to retrieve country borders');
    }
});

var markerCluster = L.markerClusterGroup();
var markers;
var markersGroup;
/// Run when select country ///
$('#searchbar').change(() => {
    // reset border and details
    removeBorder();
    markerCluster.clearLayers();
    markers = [];

    store.name = $('#searchbar').val();
    let selectedCountry = store.geoJSON.features.filter(country => country.properties.name === store.name);
    store.code = selectedCountry[0].properties.iso_a2;

    store.countryBorder = L.geoJSON(selectedCountry, {
        style: {
            color: "#111",
            weight: 4,
            opacity: 0.9
        },
        onEachFeature: (feature, layer) => {
            layer.myTag = "myGeoJSON"
        }
    }).addTo(mymap);

    mymap.fitBounds(store.countryBorder.getBounds());
    
    $.ajax({
        url: "libs/php/info/getDemographics.php",
        method: 'POST',
        data: {
            code: store.code
        },
        success: (result) => {
            store.capital = result.data.capital;
            $.ajax({
                url: "libs/php/info/getLocation.php",
                method: 'POST',
                data: {
                    place: store.capital.replace(' ', '+')
                },
                success: (result) => {
                    store.capitalLat = result.data.lat;
                    store.capitalLng = result.data.lng;
                    let capitalMarker = L.AwesomeMarkers.icon({
                        icon: 'star',
                        prefix: 'fa',
                        markerColor: 'red'
                    });
                    markers.push(
                        L.marker([store.capitalLat, store.capitalLng], 
                        {
                            icon: capitalMarker,
                            zIndexOffset: 1000
                        }).bindPopup(
                            'Capital<hr/>' + store.capital
                        ).openPopup()
                    );
                    
                    markersGroup = L.featureGroup(markers);
                    markerCluster.addLayers(markers);
                },
                error: () => {
                    console.log('Failed to retrieve location');
                }
            });
        },
        error: () => {
            console.log('Failed to retrieve demographics data');
        }
    });

    $.ajax({
        url: "libs/php/info/getHeritageSites.php",
        method: 'POST',
        data: {
            code: store.code
        },
        success: (result) => {
            let heritageMarker = L.AwesomeMarkers.icon({
                icon: 'info',
                prefix: 'fa',
                markerColor: 'blue'
            });
            if(result.data){
                for(site of result.data){
                    markers.push(
                        L.marker([site.latitude, site.longitude], {icon: heritageMarker})
                        .bindPopup(
                            site.name + '<hr/>' + site.short_description
                        )
                    );
                }
            }
            
            markersGroup = L.featureGroup(markers);
            markerCluster.addLayers(markers);
        },
        error: () => {
            console.log('Failed to retrieve heritage sites');
        }
    });

    // Weather markers

    // Create Webcam markers
    
    // Wait for ajax calls to end before displaying
    $(document).ajaxStop(() => {
        mymap.addLayer(markerCluster);
    });
});

$('#wikipedia').click(() => {
    $.ajax({
        url: "libs/php/info/getWikiEntries.php",
        method: 'POST',
        data: {
            search: store.name.replace(' ', '+')
        },
        success: (result) => {
            if(result.data){
                let url = result.data.at(-1);
                window.open(url, '_blank').focus();
            }
        },
        error: () => {
            console.log('Failed to retrieve Wikipedia Entry');
        }
    });
});

// // Demographics details
// $('#demographics').click(() => {
//     store.enviroInfo = false;
//     store.wikiInfo = false;
//     reqDemographicsInfo();
// });

// // Economy details
// $('#economy').click(() => {
//     store.enviroInfo = false;
//     store.wikiInfo = false;
//     $.ajax({
//         url: "libs/php/info/getEconomy.php",
//         method: 'POST',
//         data: {
//             code: store.code
//         },
//         success: (result) => {
//             let economyInfo = result.data.map(info => JSON.parse(info));

//             let gdp;
//             for(let i = 0; i < economyInfo[0][1].length; i++){
//                 if(economyInfo[0][1][i].value){
//                     gdp = [  Math.round(economyInfo[0][1][i].value * 100) / 100 , economyInfo[0][1][i].date];
//                     break;
//                 }
//             }

//             let exRate;
//             for(let i = 0; i < economyInfo[0][1].length; i++){
//                 if(economyInfo[1][1][i].value){
//                     exRate = [economyInfo[1][1][i].value, economyInfo[1][1][i].date];
//                     break;
//                 }
//             }

//             let unemployRate;
//             for(let i = 0; i < economyInfo[0][1].length; i++){
//                 if(economyInfo[2][1][i].value){
//                     unemployRate = [economyInfo[2][1][i].value, economyInfo[2][1][i].date];
//                     break;
//                 }
//             }

//             let accToElectric;
//             for(let i = 0; i < economyInfo[0][1].length; i++){
//                 if(economyInfo[3][1][i].value){
//                     accToElectric = [economyInfo[3][1][i].value, economyInfo[3][1][i].date];
//                     break;
//                 }
//             }

//             $('#details-results').html(
//                 "<hr/>GDP per Capita: $" + gdp[0] + " (" + gdp[1] + ")<hr/>" +
//                 "Exchange Rate: " + exRate[0] + " (" + exRate[1] + ")<hr/>" +
//                 "Unemployment Rate: " + unemployRate[0] + "% (" + unemployRate[1] + ")<hr/>" +
//                 "Access to Electricity: " + accToElectric[0] + "% (" + accToElectric[1] + ")"
//             );
//         },
//         error: () => {
//             console.log('failed to retrieve economy data');
//         }
//     });
// });

// // Wiki Entries details
// const reqWikiInfo = () => {
//     $.ajax({
//         url: "libs/php/info/getWikiEntries.php",
//         method: 'POST',
//         data: {
//             lat: store.lat,
//             lng: store.lng
//         },
//         success: (result) => {
//             $('#details-results').html('');
//             $('#details-results').append(
//                 "<b>Click on the map to show wiki entries around that point and update details<b/>"
//             );
//             for (let i = 0;  i < result['data'].length; i++) {
//                 $('#details-results').append(
//                     "<hr/><p>Summary: " + result['data'][i]['summary']
//                     + "</p><p>URL: " + result['data'][i]['wikipediaUrl']
//                     + "</p>"
//                 );
//             }
//         },
//         error: () => {
//             console.log('Could not retrieve Wiki Entries');
//         }
//     });
// }

// $('#wiki').click(() => {
//     store.enviroInfo = false;
//     store.wikiInfo = true;
//     reqWikiInfo();
// });

// // Environment details
// const reqEnvironmentInfo = () => {
//     $.ajax({
//         url: "libs/php/info/getEnvironment.php",
//         method: 'POST',
//         data: {
//             lat: store.lat,
//             lng: store.lng,
//             code: store.code
//         },
//         success: (result) => {
//             let enviroInfo = result.data.map(info => JSON.parse(info));
//             console.log(enviroInfo);

//             // Find latest valid value
//             let renewOutput;
//             for(let i = 0; i < enviroInfo[2][1].length; i++){
//                 if(enviroInfo[2][1][i].value){
//                     renewOutput = [  enviroInfo[2][1][i].value , enviroInfo[2][1][i].date];
//                     break;
//                 }
//             }

//             let co2Emiss;
//             for(let i = 0; i < enviroInfo[3][1].length; i++){
//                 if(enviroInfo[2][1][i].value){
//                     co2Emiss = [  enviroInfo[3][1][i].value , enviroInfo[3][1][i].date];
//                     break;
//                 }
//             }

//             let urbanPop;
//             for(let i = 0; i < enviroInfo[4][1].length; i++){
//                 if(enviroInfo[2][1][i].value){
//                     urbanPop = [  enviroInfo[4][1][i].value , enviroInfo[4][1][i].date];
//                     break;
//                 }
//             }

//             $('#details-results').html(
//                 "<b>Click location on map to update weather</b>" +
//                 // Weather
//                 "<hr/>Weather<br/>Temperature: " + enviroInfo[0].current.temp_c + "&#176;C" +
//                 "<br/>Condition: " +  enviroInfo[0].current.condition.text + 
//                 // Forecast
//                 "<hr/>Forecast<br/>Temperature: " + enviroInfo[1].forecast.forecastday[0].day.avgtemp_c +
//                 "&#176;C<br/>Condition: " + enviroInfo[1].forecast.forecastday[0].day.condition.text +
//                 // Renewable Energy Output
//                 "<hr/>Renewable Energy Output: " + renewOutput[0] + " (" + renewOutput[1] + ") " +
//                 // CO2 Emissions
//                 "<hr/>CO2 Emissions (metric ton per capita): " + co2Emiss[0] + " (" + co2Emiss[1] + ") " +
//                 // Urban Population
//                 "<hr/>Urban Population: " + urbanPop[0] + "% (" + urbanPop[1] + ")"
//             );
//         },
//         error: () => {
//             console.log('Failed to retrieve Environment data');
//         }
//     });
// }

// $('#enviro').click(() => {
//     store.wikiInfo = false;
//     store.enviroInfo = true;
//     reqEnvironmentInfo();
// });
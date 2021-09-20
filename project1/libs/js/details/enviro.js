const reqEnvironmentInfo = () => {
    $.ajax({
        url: "libs/php/info/getEnvironment.php",
        method: 'POST',
        data: {
            lat: store.lat,
            lng: store.lng,
            code: store.code
        },
        success: (result) => {
            let enviroInfo = result.data.map(info => JSON.parse(info));
            console.log(enviroInfo);

            // Find latest valid value
            let renewOutput;
            for(let i = 0; i < enviroInfo[2][1].length; i++){
                if(enviroInfo[2][1][i].value){
                    renewOutput = [  enviroInfo[2][1][i].value , enviroInfo[2][1][i].date];
                    break;
                }
            }

            let co2Emiss;
            for(let i = 0; i < enviroInfo[3][1].length; i++){
                if(enviroInfo[2][1][i].value){
                    co2Emiss = [  enviroInfo[3][1][i].value , enviroInfo[3][1][i].date];
                    break;
                }
            }

            let urbanPop;
            for(let i = 0; i < enviroInfo[4][1].length; i++){
                if(enviroInfo[2][1][i].value){
                    urbanPop = [  enviroInfo[4][1][i].value , enviroInfo[4][1][i].date];
                    break;
                }
            }

            $('#details-results').html(
                "<b>Click location on map to update weather</b>" +
                // Weather
                "<hr/>Weather<br/>Temperature: " + enviroInfo[0].current.temp_c + "&#176;C" +
                "<br/>Condition: " +  enviroInfo[0].current.condition.text + 
                // Forecast
                "<hr/>Forecast<br/>Temperature: " + enviroInfo[1].forecast.forecastday[0].day.avgtemp_c +
                "&#176;C<br/>Condition: " + enviroInfo[1].forecast.forecastday[0].day.condition.text +
                // Renewable Energy Output
                "<hr/>Renewable Energy Output: " + renewOutput[0] + " (" + renewOutput[1] + ") " +
                // CO2 Emissions
                "<hr/>CO2 Emissions (metric ton per capita): " + co2Emiss[0] + " (" + co2Emiss[1] + ") " +
                // Urban Population
                "<hr/>Urban Population: " + urbanPop[0] + "% (" + urbanPop[1] + ")"
            );
        },
        error: () => {
            console.log('Failed to retrieve Environment data');
        }
    });
}

$('#enviro').click(() => {
    store.wikiInfo = false;
    store.enviroInfo = true;
    reqEnvironmentInfo();
});
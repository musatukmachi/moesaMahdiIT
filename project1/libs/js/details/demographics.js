$('#demographics').click(() => {
    $.ajax({
        url: "libs/php/setup/getCountryCode.php",
        method: 'POST',
        data: {
            name: $('input').val()
        },
        success: (result) => {
            console.log("request for country code: ", result)
            $.ajax({
                url: "libs/php/info/getDemographics.php",
                method: 'POST',
                data: {
                    code: result
                },
                success: (result) => {
                    console.log("demographics data: ", result);
                    let countryLanguages = '';
                    for(el of result.data.languages){
                        countryLanguages += el.name;
                        if(el !== result.data.languages.at(-1)){
                            countryLanguages += ', ';
                        }
                    }
                    
                    $('#details-results').html(
                        "Population: " + result.data.population + "<br/>" +
                        "Capital: " + result.data.capital + "<br/>" +
                        "Language: " + countryLanguages
                        );
                },
                error: () => {
                    console.log('Failed to retrieve demographics data');
                }
            });
        },
        error: () => {
            console.log('Failed to retrieve country code');
        }
    });
});
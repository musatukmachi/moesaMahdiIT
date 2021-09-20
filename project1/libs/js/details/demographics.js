const reqDemographicsInfo = () => {
    $.ajax({
        url: "libs/php/info/getDemographics.php",
        method: 'POST',
        data: {
            code: store.code
        },
        success: (result) => {
            store.capital = result.data.capital;
            console.log("demographics data: ", result);
            let countryLanguages = '';
            for(el of result.data.languages){
                countryLanguages += el.name;
                if(el !== result.data.languages.at(-1)){
                    countryLanguages += ', ';
                }
            }
            
            $('#details-results').html(
                "<hr/>Population: " + result.data.population + "<hr/>" +
                "Capital: " + result.data.capital + "<hr/>" +
                "Language: " + countryLanguages
                );
        },
        error: () => {
            console.log('Failed to retrieve demographics data');
        }
    });
}

$('#demographics').click(() => {
    store.enviroInfo = false;
    store.wikiInfo = false;
    reqDemographicsInfo();
});
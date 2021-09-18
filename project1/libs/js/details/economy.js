$('#economy').click(() => {
    $.ajax({
        url: "libs/php/setup/getCountryCode.php",
        method: 'POST',
        data: {
            name: $('input').val()
        },
        success: (result) => {
            $.ajax({
                url: "libs/php/info/getEconomy.php",
                method: 'POST',
                data: {
                    code: result
                },
                success: (result) => {
                    let economyInfo = result.data.map(info => JSON.parse(info));

                    let gdp;
                    for(let i = 0; i < economyInfo[0][1].length; i++){
                        if(economyInfo[0][1][i].value){
                            gdp = [economyInfo[0][1][i].value, economyInfo[0][1][i].date];
                            break;
                        }
                    }

                    let er;
                    for(let i = 0; i < economyInfo[0][1].length; i++){
                        if(economyInfo[1][1][i].value){
                            er = [economyInfo[1][1][i].value, economyInfo[1][1][i].date];
                            break;
                        }
                    }

                    let ur;
                    for(let i = 0; i < economyInfo[0][1].length; i++){
                        if(economyInfo[2][1][i].value){
                            ur = [economyInfo[2][1][i].value, economyInfo[2][1][i].date];
                            break;
                        }
                    }

                    let ate;
                    for(let i = 0; i < economyInfo[0][1].length; i++){
                        if(economyInfo[3][1][i].value){
                            ate = [economyInfo[3][1][i].value, economyInfo[3][1][i].date];
                            break;
                        }
                    }

                    $('#details-results').html(
                        "GDP per Capita: " + gdp[0] + "$ (" + gdp[1] + ")<hr/>" +
                        "Exchange Rate: " + er[0] + " (" + er[1] + ")<hr/>" +
                        "Unemployment Rate: " + ur[0] + " (" + ur[1] + ")<hr/>" +
                        "Access to Electricity: " + ate[0] + " (" + ate[1] + ")"
                    );
                },
                error: () => {
                    console.log('failed to retrieve economy data');
                }
            });
        },
        error: () => {
            console.log('failed to retrieve country code');
        }
    });
});
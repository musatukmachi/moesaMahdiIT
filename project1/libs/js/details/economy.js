$('#economy').click(() => {
    store.enviroInfo = false;
    store.wikiInfo = false;
    $.ajax({
        url: "libs/php/info/getEconomy.php",
        method: 'POST',
        data: {
            code: store.code
        },
        success: (result) => {
            let economyInfo = result.data.map(info => JSON.parse(info));

            let gdp;
            for(let i = 0; i < economyInfo[0][1].length; i++){
                if(economyInfo[0][1][i].value){
                    gdp = [  Math.round(economyInfo[0][1][i].value * 100) / 100 , economyInfo[0][1][i].date];
                    break;
                }
            }

            let exRate;
            for(let i = 0; i < economyInfo[0][1].length; i++){
                if(economyInfo[1][1][i].value){
                    exRate = [economyInfo[1][1][i].value, economyInfo[1][1][i].date];
                    break;
                }
            }

            let unemployRate;
            for(let i = 0; i < economyInfo[0][1].length; i++){
                if(economyInfo[2][1][i].value){
                    unemployRate = [economyInfo[2][1][i].value, economyInfo[2][1][i].date];
                    break;
                }
            }

            let accToElectric;
            for(let i = 0; i < economyInfo[0][1].length; i++){
                if(economyInfo[3][1][i].value){
                    accToElectric = [economyInfo[3][1][i].value, economyInfo[3][1][i].date];
                    break;
                }
            }

            $('#details-results').html(
                "<hr/>GDP per Capita: $" + gdp[0] + " (" + gdp[1] + ")<hr/>" +
                "Exchange Rate: " + exRate[0] + " (" + exRate[1] + ")<hr/>" +
                "Unemployment Rate: " + unemployRate[0] + "% (" + unemployRate[1] + ")<hr/>" +
                "Access to Electricity: " + accToElectric[0] + "% (" + accToElectric[1] + ")"
            );
        },
        error: () => {
            console.log('failed to retrieve economy data');
        }
    });
});
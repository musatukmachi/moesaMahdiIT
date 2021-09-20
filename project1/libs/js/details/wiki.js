const reqWikiInfo = () => {
    $.ajax({
        url: "libs/php/info/getWikiEntries.php",
        method: 'POST',
        data: {
            lat: store.lat,
            lng: store.lng
        },
        success: (result) => {
            $('#details-results').html('');
            $('#details-results').append(
                "<b>Click on the map to show wiki entries around that point and update details<b/>"
            );
            for (let i = 0;  i < result['data'].length; i++) {
                $('#details-results').append(
                    "<hr/><p>Summary: " + result['data'][i]['summary']
                    + "</p><p>URL: " + result['data'][i]['wikipediaUrl']
                    + "</p>"
                );
            }
        },
        error: () => {
            console.log('Could not retrieve Wiki Entries');
        }
    });
}

$('#wiki').click(() => {
    store.enviroInfo = false;
    store.wikiInfo = true;
    reqWikiInfo();
});
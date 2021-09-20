mymap.on('click', (e) => {
    store.lat = e.latlng.lat;
    store.lng = e.latlng.lng;

    // Update weather info
    if(store.enviroInfo === true){
        reqEnvironmentInfo();
    }
    else if(store.wikiInfo === true){
        reqWikiInfo();
    }

    // Create wiki entries markers on location
    $.ajax({
        url: "libs/php/info/getWikiEntries.php",
        method: 'POST',
        data: {
            lat: e.latlng.lat,
            lng: e.latlng.lng
        },
        success: (result) => {
            console.log(result);
            for(entry of result.data) {
                L.marker([entry.lat, entry.lng]).addTo(mymap)
                .bindPopup(
                    entry.title + '<hr/>' + entry.summary
                ).openPopup();
            }
        },
        error: () => {
            console.log('Could not retrieve Wiki Entries');
        }
    });
});
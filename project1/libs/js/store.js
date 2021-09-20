// This manages the state of the app. It contains the country details
// which saves me from constantly making the requests for info which is used
// in multiple places
var store = {
    name: null,
    code: null,
    capital: null,
    lat: null,
    lng: null,
    enviroInfo: false,
    wikiInfo: false
}
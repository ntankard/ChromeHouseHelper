/**
 * Scrape the building data from any homes apartment type page
 * @return {Building} The scraped building
 */
function scrapeApartment() {
    let building = new Building();
    building.IDs[SITE_TOKYU] = String(document.location.href.split("/")[document.location.href.split("/").length - 2]);
    building.siteType = SITE_TOKYU;

    // Base Building Info
    // TODO building.name = ;
    // TODO building.address = ;
    // TODO building.englishName = ;

    // TODO building.googleMapLink = ;
    // TODO building.stories = ;

    // TODO building.age = ;
    // TODO building.constructionDateYear = ;
    // TODO building.constructionDateMonth = ;

    // for (stationContainer of TBD) {
    //     let station = new Station();

    //      TODO station.distance = ;

    //      TODO station.line = ;
    //      TODO  station.station = ;

    //     building.stations.push(station);
    // }

    // Apartment Info
    building.apartments[0] = new Apartment();
    building.apartments[0].IDs[SITE_TOKYU] = String(document.location.href.split("/")[document.location.href.split("/").length - 1]);

    // TODO building.apartments[0].price = ;
    // TODO building.apartments[0].floor = ;
    // TODO building.apartments[0].deposit = ;
    // TODO building.apartments[0].keyMoney = ;
    // TODO building.apartments[0].layout = ;
    // TODO building.apartments[0].size = ;
    // TODO building.apartments[0].managementFee = ;

    // TODO building.urls = ;

    return building;
}

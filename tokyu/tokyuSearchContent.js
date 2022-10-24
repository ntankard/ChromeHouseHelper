/**
 * Is this a search type page?
 * @returns True if this a search type page?
 */
function isSearchPage() {
    return document.getElementsByClassName("rent_item").length != 0;
}

/**
 * Get the number of apartment for this building
 * @param {*} buildingIndex The building to get (matching the index as returned from getBuildings()) 
 * @returns The number of apartments on the page
 */
function getNumApartments(buildingIndex) {
    return document.getElementsByClassName("rent_item")[buildingIndex].getElementsByClassName("item_room_table")[0].children[0].children[2].children.length;
}

/**
 * Get all buildings on the page
 * @returns All buildings
 */
function getBuildings() {
    let buildings = [];
    for (buildingContainer of document.getElementsByClassName("rent_item")) {
        let buildingURL = buildingContainer.getElementsByClassName("clearfix")[0].children[0].getAttribute("href");

        let building = new Building();
        building.IDs[SITE_TOKYU] = String(buildingURL.split("/")[buildingURL.split("/").length - 1]);
        building.siteType = SITE_TOKYU;

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

        for (apartmentContainer of buildingContainer.getElementsByClassName("item_room_table")[0].children[0].children[2].children) {
            let url = apartmentContainer.children[6].children[0].getAttribute("href");

            let apartment = new Apartment();
            apartment.IDs[SITE_TOKYU] = String(url.split("/")[url.split("/").length - 1]);

            // TODO apartment.price = ;
            // TODO apartment.floor = ;
            // TODO apartment.deposit = ;
            // TODO apartment.keyMoney = ;
            // TODO apartment.layout = ;
            // TODO apartment.size = ;
            // TODO apartment.managementFee = ;

            // TODO apartment.urls[SITE_TOKYU] = url;

            building.apartments.push(apartment);
        }

        buildings.push(building);
    }

    return buildings;
}

/**
 * Shade a building listing a certain color
 * @param {*} buildingIndex The building to color (matching the index as returned from getBuildings())
 * @param {*} color The color to set
 */
function setBuildingColor(buildingIndex, color) {
    document.getElementsByClassName("rent_item")[buildingIndex].getElementsByClassName("clearfix")[0].style['background-color'] = color;
}

/**
 * Shade a apartment listing a certain color
 * @param {*} buildingIndex The building to color (matching the index as returned from getBuildings())
 * @param {*} apartmentIndex The apartment to color (matching the index as returned from getBuildings())
 * @param {*} color The color to set
 */
function setApartmentColor(buildingIndex, apartmentIndex, color) {
    document.getElementsByClassName("rent_item")[buildingIndex].getElementsByClassName("item_room_table")[0].children[0].children[2].children[apartmentIndex].style['background-color'] = color;
}

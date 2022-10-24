/**
 * Is this a search type page?
 * @returns True if this a search type page?
 */
function isSearchPage() {
    return true;
}

/**
 * Get the number of apartment for this building
 * @param {*} buildingIndex The building to get (matching the index as returned from getBuildings()) 
 * @returns The number of apartments on the page
 */
function getNumApartments(buildingIndex) {
    return document.getElementsByClassName("moduleInner prg-building")[buildingIndex].getElementsByClassName("detail").length - 1;
}

/**
 * Get all buildings on the page
 * @returns All buildings
 */
function getBuildings() {
    let buildings = [];
    for (buildingContainer of document.getElementsByClassName("moduleInner prg-building")) {

        let building = new Building();
        // TODO building.IDs[SITE_HOMES] = ;
        building.siteType = SITE_HOMES;

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

        let isFirst = true;
        for (apartmentContainer of buildingContainer.getElementsByClassName("detail")) {
            if (isFirst) {
                isFirst = false;
                continue;
            }

            let url = apartmentContainer.childNodes[0].getAttribute("href");

            let apartment = new Apartment();
            apartment.IDs[SITE_HOMES] = String(url.split("/")[url.split("/").length - 2]);

            // TODO apartment.price = ;
            // TODO apartment.floor = ;
            // TODO apartment.deposit = ;
            // TODO apartment.keyMoney = ;
            // TODO apartment.layout = ;
            // TODO apartment.size = ;
            // TODO apartment.managementFee = ;

            apartment.urls[SITE_HOMES] = url;

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
    document.getElementsByClassName("moduleInner prg-building")[buildingIndex].getElementsByClassName("moduleHead")[0].style['background-color'] = color;
    console.log(document.getElementsByClassName("moduleInner prg-building")[buildingIndex]);
}

/**
 * Shade a apartment listing a certain color
 * @param {*} buildingIndex The building to color (matching the index as returned from getBuildings())
 * @param {*} apartmentIndex The apartment to color (matching the index as returned from getBuildings())
 * @param {*} color The color to set
 */
function setApartmentColor(buildingIndex, apartmentIndex, color) {
    document.getElementsByClassName("moduleInner prg-building")[buildingIndex].getElementsByClassName("floarPlan")[apartmentIndex + 1].style['background-color'] = color;
}

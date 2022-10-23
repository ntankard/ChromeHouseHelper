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
    return document.getElementsByClassName("boxBuildingList")[buildingIndex].getElementsByClassName("room-list-item").length;
}

/**
 * Get all buildings on the page
 * @returns All buildings
 */
function getBuildings() {
    let buildings = [];
    for (buildingContainer of document.getElementsByClassName("boxBuildingList")) {
        let buildingInfo = buildingContainer.getElementsByClassName("building-list-data")[0];

        let building = new Building();
        building.IDs[SITE_RNT] = String(buildingContainer.getElementsByClassName("heading heading-dark lg-heading-big")[0].children[0].getAttribute("href").split("/")[3]);
        building.siteType = SITE_RNT;

        building.name = buildingContainer.getElementsByClassName("heading heading-dark lg-heading-big")[0].children[0].innerHTML;
        building.address = buildingInfo.children[3].childNodes[0].data.replace("\n\t\t\t\t\t\t", "").replace("\t\t\t\t\t\t（", "").replace("\t\t\t\t\t\t", " ");
        building.englishName = buildingContainer.getElementsByClassName("sub-heading sub-heading-gray")[0].innerHTML.split(" (")[0];

        building.googleMapLink = buildingInfo.children[3].childNodes[1].getAttribute("href");
        building.stories = parseInt(buildingInfo.children[19].innerHTML.replace("地上 ", "").replace("階", ""));

        // building.age NA for this site
        building.constructionDate = {
            year: parseInt(buildingInfo.children[13].innerHTML.split("年")[0]),
            month: parseInt(buildingInfo.children[13].innerHTML.split("年")[1].replace("月", ""))
        }

        for (stationContainer of buildingInfo.children[5].children[0].children) {
            let station = new Station();

            station.distance = parseInt(stationContainer.children[2].innerHTML.replace("&nbsp;", "").replace("徒歩", "").replace("分", ""));

            station.line = stationContainer.children[0].innerHTML.replace("&nbsp;", "");
            station.station = stationContainer.children[1].innerHTML;

            building.stations.push(station);
        }

        for (apartmentContainer of buildingContainer.getElementsByClassName("room-list-item")) {
            let data = apartmentContainer.children[0].getElementsByClassName("room-list-content-block");
            let moneySection = data[0].children;
            let depositSection = data[1].children[0].childNodes;
            let keyMoneySection = data[1].children[1].childNodes;
            let layoutSection = data[2].innerHTML.split("/");

            let apartment = new Apartment();
            apartment.IDs[SITE_RNT] = String(apartmentContainer.children[0].getAttribute("href").split("/")[3]);

            apartment.price = parseMoney(moneySection[0].innerHTML);
            apartment.floor = parseInt(layoutSection[0].replace("階", ""));
            if (depositSection.length == 5) {
                apartment.deposit = parseFloat(depositSection[3].innerHTML);
            } else {
                apartment.deposit = parseFloat(depositSection[2].data.replace("ヶ月", ""));
            }
            if (keyMoneySection.length == 5) {
                apartment.keyMoney = parseFloat(keyMoneySection[3].innerHTML);
            } else {
                apartment.keyMoney = parseFloat(keyMoneySection[2].data.replace("ヶ月", ""));
            }
            apartment.layout = layoutSection[1].replaceAll(" ", "");
            apartment.size = parseFloat(layoutSection[2].replace("m²", ""));

            apartment.managementFee = parseMoney(moneySection[2].innerHTML);

            // this.urls TODO

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
    document.getElementsByClassName("boxBuildingList")[buildingIndex].getElementsByClassName("boxBuildingListInner")[0].style['background-color'] = color;
}

/**
 * Shade a apartment listing a certain color
 * @param {*} buildingIndex The building to color (matching the index as returned from getBuildings())
 * @param {*} apartmentIndex The apartment to color (matching the index as returned from getBuildings())
 * @param {*} color The color to set
 */
function setApartmentColor(buildingIndex, apartmentIndex, color) {
    document.getElementsByClassName("boxBuildingList")[buildingIndex].getElementsByClassName("room-list-item")[apartmentIndex].style['background-color'] = color;
}

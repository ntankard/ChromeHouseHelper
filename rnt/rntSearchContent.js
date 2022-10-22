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
        let building = new Building();

        building.rntName = buildingContainer.getElementsByClassName("heading heading-dark lg-heading-big")[0].children[0].innerHTML;
        building.name = building.rntName;

        building.rntEnglishName = buildingContainer.getElementsByClassName("sub-heading sub-heading-gray")[0].innerHTML.split(" (")[0];

        building.rntID = String(buildingContainer.getElementsByClassName("heading heading-dark lg-heading-big")[0].children[0].getAttribute("href").split("/")[3]);

        let buildingInfo = buildingContainer.getElementsByClassName("building-list-data")[0];

        building.rntAddress = buildingInfo.children[3].childNodes[0].data.replace("\n\t\t\t\t\t\t", "").replace("\t\t\t\t\t\t（", "").replace("\t\t\t\t\t\t", " ");
        building.address = building.rntAddress;

        building.googleMapLink = buildingInfo.children[3].childNodes[1].getAttribute("href");

        building.stories = parseInt(buildingInfo.children[19].innerHTML.replace("地上 ", "").replace("階", ""));

        building.constructionDate = {
            year: parseInt(buildingInfo.children[13].innerHTML.split("年")[0]),
            month: parseInt(buildingInfo.children[13].innerHTML.split("年")[1].replace("月", ""))
        }

        for (stationContainer of buildingInfo.children[5].children[0].children) {
            let station = new Station();
            station.line = stationContainer.children[0].innerHTML.replace("&nbsp;", "");
            station.station = stationContainer.children[1].innerHTML;
            station.distance = parseInt(stationContainer.children[2].innerHTML.replace("&nbsp;", "").replace("徒歩", "").replace("分", ""))
            building.stations.push(station);
        }

        for (apartmentContainer of buildingContainer.getElementsByClassName("room-list-item")) {
            let apartment = new Apartment();

            apartment.rntID = String(apartmentContainer.children[0].getAttribute("href").split("/")[3]);

            let data = apartmentContainer.children[0].getElementsByClassName("room-list-content-block");

            let moneySection = data[0].children;
            apartment.price = parseMoney(moneySection[0].innerHTML);
            apartment.managementFee = parseMoney(moneySection[2].innerHTML);

            let depositSection = data[1].children[0].childNodes;
            if (depositSection.length == 5) {
                apartment.deposit = parseFloat(depositSection[3].innerHTML);
            } else {
                apartment.deposit = parseFloat(depositSection[2].data.replace("ヶ月", ""));
            }

            let keyMoneySection = data[1].children[1].childNodes;
            if (keyMoneySection.length == 5) {
                apartment.keyMoney = parseFloat(keyMoneySection[3].innerHTML);
            } else {
                apartment.keyMoney = parseFloat(keyMoneySection[2].data.replace("ヶ月", ""));
            }

            let layoutSection = data[2].innerHTML.split("/");
            apartment.floor = parseInt(layoutSection[0].replace("階", ""));
            apartment.layout = layoutSection[1].replaceAll(" ", "");
            apartment.size = parseFloat(layoutSection[2].replace("m²", ""));

            building.apartments.push(apartment);
        }

        buildings.push(building);
    }

    console.log(buildings);
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

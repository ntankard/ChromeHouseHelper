
/**
 * Is this a search type page?
 * @returns True if this a search type page?
 */
function isSearchPage() {
    return document.getElementsByClassName("conditionbox").length != 0;
}

/**
 * Get the number of apartment for this building
 * @param {*} buildingIndex The building to get (matching the index as returned from getBuildings()) 
 * @returns The number of apartments on the page
 */
function getNumApartments(buildingIndex) {
    return document.getElementsByClassName("cassetteitem")[buildingIndex].getElementsByClassName("js-cassette_link").length;
}

/**
 * Get all buildings on the page
 * @returns All buildings
 */
function getBuildings() {
    let buildings = [];
    for (buildingContainer of document.getElementsByClassName("cassetteitem")) {
        let building = new Building();

        building.suumoName = buildingContainer.getElementsByClassName("cassetteitem_content-title")[0].innerHTML;
        building.name = building.suumoName.replace(/[0-9]/g, '');
        building.suumoAddress = buildingContainer.getElementsByClassName("cassetteitem_detail-col1")[0].innerHTML;
        building.address = building.suumoAddress;
        building.age = extractAge(buildingContainer.getElementsByClassName("cassetteitem_detail-col3")[0].firstElementChild.innerHTML.replace("築", "").replace("年", ""));
        building.stories = parseInt(buildingContainer.getElementsByClassName("cassetteitem_detail-col3")[0].lastElementChild.innerHTML.replace("階建", ""));

        for (station of buildingContainer.getElementsByClassName("cassetteitem_detail-col2")[0].getElementsByClassName("cassetteitem_detail-text")) {
            let createdStation = extractStation(station.innerHTML);
            if (createdStation) {
                building.stations.push(createdStation);
            }
        }

        for (apartmentContainer of buildingContainer.getElementsByClassName("js-cassette_link")) {
            let apartment = new Apartment();

            apartment.price = parseMoney(apartmentContainer.getElementsByClassName("cassetteitem_price cassetteitem_price--rent")[0].children[0].innerHTML);
            apartment.managementFee = parseMoney(apartmentContainer.getElementsByClassName("cassetteitem_price cassetteitem_price--administration")[0].innerHTML);
            apartment.floor = parseInt(apartmentContainer.children[2].innerHTML.replace("階", "").replace("\n\t\t\t\t\t\t\t\t\t\t\t", ""));
            apartment.deposit = parseMoney(apartmentContainer.getElementsByClassName("cassetteitem_price cassetteitem_price--deposit")[0].innerHTML);
            apartment.keyMoney = parseMoney(apartmentContainer.getElementsByClassName("cassetteitem_price cassetteitem_price--gratuity")[0].innerHTML);

            apartment.layout = apartmentContainer.getElementsByClassName("cassetteitem_madori")[0].innerHTML;
            apartment.size = parseFloat(apartmentContainer.getElementsByClassName("cassetteitem_menseki")[0].innerHTML.replace("m<sup>2</sup>", ""));

            // Get URL link
            let url = "https://suumo.jp" + apartmentContainer.getElementsByClassName("ui-text--midium ui-text--bold")[0].children[0].getAttribute("href").split("?")[0];
            let urlResult = processSuumoURL(url);
            apartment.suumoBaseURL = urlResult.baseURL;
            apartment.suumoID = urlResult.suumoID;

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
    document.getElementsByClassName("cassetteitem")[buildingIndex].getElementsByClassName("cassetteitem-detail")[0].style['background-color'] = color;
}

/**
 * Shade a apartment listing a certain color
 * @param {*} buildingIndex The building to color (matching the index as returned from getBuildings())
 * @param {*} apartmentIndex The apartment to color (matching the index as returned from getBuildings())
 * @param {*} color The color to set
 */
function setApartmentColor(buildingIndex, apartmentIndex, color) {
    document.getElementsByClassName("cassetteitem")[buildingIndex].getElementsByClassName("js-cassette_link")[apartmentIndex].style['background-color'] = color;
}

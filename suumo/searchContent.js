
// LOCAL DATA ==========================================================================================================

let pageType = PAGE_TYPE_UNKNOWN;

// MAIN CODE ===========================================================================================================

if (document.getElementsByClassName("conditionbox").length != 0) {
    pageType = PAGE_TYPE_APARTMENT;
    loadSearchPage();
}

// Enable response to requests
chrome.runtime.onMessage.addListener(gotMessage);

// FUNCTIONS ===========================================================================================================

/**
 * Process all income messages. Expects message.type to be present and can respond to getPageType and getApartment 
 * depending on the page type
 * @param {*} message 
 * @param {*} sender 
 * @param {*} sendResponse 
 */
function gotMessage(message, sender, sendResponse) {
    switch (message.type) {
        case REQUEST_PAGE_TYPE:
            sendResponse(pageType);
            break;
    }
}

/**
 * Process all search results and look for matches
 */
async function loadSearchPage() {
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

        let totalResult = await findBuilding(building);
        if (totalResult.building.databaseID != -1) {

            // Process building color
            if (totalResult.building.status == "BAD") {
                buildingContainer.getElementsByClassName("cassetteitem-detail")[0].style['background-color'] = '#FF0000';
            } else {
                buildingContainer.getElementsByClassName("cassetteitem-detail")[0].style['background-color'] = '#FF9000';
            }

            // Process apartment color
            let webApartments = buildingContainer.getElementsByClassName("js-cassette_link");
            for (let i = 0; i < webApartments.length; i++) {
                if (totalResult.apartmentMapping[i] != -1) {
                    let apartmentMatch = totalResult.building.apartments[totalResult.apartmentMapping[i]];
                    if (apartmentMatch.databaseID != -1) {
                        if (apartmentMatch.status == "GOOD") {
                            webApartments[i].style['background-color'] = '#00FF00';
                        }
                        if (apartmentMatch.status == "BAD") {
                            webApartments[i].style['background-color'] = '#FF0000';
                        }
                    }
                }
            }
        }


        buildings.push(building);
    }

    console.log(buildings);
}

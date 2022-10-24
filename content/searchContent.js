// LOCAL DATA ==========================================================================================================

let pageType = PAGE_TYPE_UNKNOWN;

// MAIN CODE ===========================================================================================================

if (isSearchPage()) {
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
    let buildings = getBuildings();

    for (let buildingIndex = 0; buildingIndex < buildings.length; buildingIndex++) {

        let building = buildings[buildingIndex];

        // TODO problem here. For site like suumo that don't have building IDs there will be multiple entries per building and this only gets 1
        let totalResult = await findBuilding(building);
        if (totalResult.building.databaseID != -1) {

            // Process building color
            if (totalResult.building.status == "BAD") {
                setBuildingColor(buildingIndex, '#FF0000');
            } else {
                setBuildingColor(buildingIndex, '#FF9000');
            }

            // Process apartment color
            for (let i = 0; i < getNumApartments(buildingIndex); i++) {
                if (totalResult.apartmentMapping[i] != -1) {
                    let apartmentMatch = totalResult.building.apartments[totalResult.apartmentMapping[i]];
                    if (apartmentMatch.databaseID != -1) {
                        if (apartmentMatch.status == "GOOD") {
                            setApartmentColor(buildingIndex, i, '#00FF00');
                        }
                        if (apartmentMatch.status == "BAD") {
                            setApartmentColor(buildingIndex, i, '#FF0000');
                        }
                    }
                }
            }
        }
    }
}

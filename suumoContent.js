// LOCAL DATA ==========================================================================================================

let pageType;
let rawBuilding;

// MAIN CODE ===========================================================================================================

// What page are we running on?
pageType = getPageType();
console.log("Detected page type is: " + pageType);

// If its a Apartment type, scrape the core data
switch (pageType) {
    case "Apartment_2":
        loadApartmentPage();
        break;
}

// Enable response to requests
chrome.runtime.onMessage.addListener(gotMessage);

// FUNCTIONS ===========================================================================================================

/**
 * Load the page assuming an apartment style page
 */
function loadApartmentPage() {
    switch (pageType) {
        case "Apartment_2":
            rawBuilding = getBuilding2();
            break;
    }
}

/**
 * Process all income messages. Expects message.type to be present and can respond to getPageType and getApartment 
 * depending on the page type
 * @param {*} message 
 * @param {*} sender 
 * @param {*} sendResponse 
 */
function gotMessage(message, sender, sendResponse) {
    switch (message.type) {
        case "getPageType":
            sendResponse(pageType);
            break;
        case "getApartment":
            loadApartmentPage(); // Reload data incase the popup has changed it and is reloading itself
            if (rawBuilding) {
                sendResponse(rawBuilding);
            } else {
                console.log("Calling getApartment on a non apartment page"); // TODO error
            }
            break;
    }
}

/**
 * Based on the data on the page, determine what type of page it is
 * @returns A string representing the page type 
 */
function getPageType() {
    if (document.getElementsByClassName("conditionbox").length != 0) {
        return "Search";
    }
    if (document.getElementsByClassName("property_view_detail property_view_detail--yen").length != 0) {
        return "Apartment_1";
    }
    if (document.getElementsByClassName("property_view_note-info").length != 0) {
        return "Apartment_2";
    }
    return "Unknown";
}

/**
 * Get the Building and Apartment details based on Apartment_2 page type
 * @returns The Building and Apartment details based on Apartment_2 page type
 */
function getBuilding2() {
    let building = new Building()
    building.apartments[0] = new Apartment()

    // Name
    building.name = document.getElementsByClassName("section_h1-header-title")[0].innerHTML;
    building.apartments[0].urls.push(document.location.href.split("?")[0]);

    // Price data
    let topRow = document.getElementsByClassName("property_view_note-info")[0].children[0];
    let bottomRow = document.getElementsByClassName("property_view_note-info")[0].children[1]
    building.apartments[0].price = parseMoney(topRow.children[0].innerHTML);
    building.apartments[0].managementFee = parseMoney(topRow.children[1].innerHTML.replace("管理費・共益費:&nbsp;", ""));
    building.apartments[0].deposit = parseMoney(bottomRow.children[0].innerHTML.replace("敷金:&nbsp;", ""))
    building.apartments[0].keyMoney = parseMoney(bottomRow.children[1].innerHTML.replace("礼金:&nbsp;", ""))

    // Table section
    let dataSection = document.getElementsByClassName("property_view_table")[0]
    building.address = dataSection.children[0].children[0].getElementsByClassName("property_view_table-body")[0].innerHTML;
    for (station of dataSection.children[0].children[1].getElementsByClassName("property_view_table-body")[0].getElementsByClassName("property_view_table-read")) {
        building.stations.push(extractStation(station.innerHTML))
    }
    building.apartments[0].layout = dataSection.children[0].children[2].children[1].innerHTML;
    building.apartments[0].size = parseFloat(dataSection.children[0].children[2].children[3].innerHTML.replace("m<sup>2</sup>", ""));
    building.age = parseFloat(dataSection.children[0].children[3].children[1].innerHTML.replace("築", "").replace("年", ""));
    building.apartments[0].floor = parseInt(dataSection.children[0].children[3].children[3].innerHTML.replace("階", ""))

    console.log("Scraped Building");
    console.log(building);

    // let buildings = [];
    // buildings.push(building)
    // chrome.storage.local.set({ 'AllBuildings': buildings });

    return building;
}

/**
 * Extract details about a nearby station from the standard form
 * @param {*} stationString 
 * @returns 
 */
function extractStation(stationString) {
    if (!stationString) {
        return
    }
    let station = new Station();
    let lineStation = stationString.split("/")
    station.line = lineStation[0];
    station.station = lineStation[1].split(" 歩")[0];
    station.distance = parseFloat(lineStation[1].split(" 歩")[1].replace("分", ""));
    return station;
}

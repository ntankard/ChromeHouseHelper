/**
 * Scrape the building data from any suumo apartment type page
 * @return {Building} The scraped building
 */
function scrapeApartment() {
    let result = processSuumoURL(document.location.href);
    let building;

    switch (result.aptType) {
        case 0:
            console.log("JNC, Map");
            throw "Unsupported page type"; // TODO
            break;
        case 1:
            console.log("JNC, Home");
            building = getSuumoApartmentRoot();
            break;
        case 2:
            console.log("BC, Map");
            throw "Unsupported page type"; // TODO
            break;
        case 3:
            console.log("BC, Home");
            throw "Unsupported page type"; // TODO
            break;
    }

    building.apartments[0].urls[SITE_SUUMO] = result.baseURL;
    building.apartments[0].IDs[SITE_SUUMO] = String(result.suumoID);

    return building;
}

/**
 * Get the Building and Apartment details based on Apartment_2 page type
 * @returns The Building and Apartment details based on Apartment_2 page type
 */
function getSuumoApartmentRoot() {
    let building = new Building();
    building.apartments[0] = new Apartment();

    // Name
    building.name = document.getElementsByClassName("section_h1-header-title")[0].innerHTML.replace(/[0-9]/g, '');

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
        let createdStation = extractStation(station.innerHTML);
        if (createdStation) {
            building.stations.push(createdStation);
        }
    }
    building.apartments[0].layout = dataSection.children[0].children[2].children[1].innerHTML;
    building.apartments[0].size = parseFloat(dataSection.children[0].children[2].children[3].innerHTML.replace("m<sup>2</sup>", ""));
    building.age = extractAge(dataSection.children[0].children[3].children[1].innerHTML.replace("築", "").replace("年", ""));
    building.apartments[0].floor = parseInt(dataSection.children[0].children[3].children[3].innerHTML.replace("階", ""))

    return building;
}

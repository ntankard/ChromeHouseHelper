/**
 * Scrape the building data from any suumo apartment type page
 * @return {Building} The scraped building
 */
function scrapeApartment() {
    let building = new Building();

    let detailBox = document.getElementsByClassName("boxDetail lg-dspb")[0].getElementsByClassName("tableDot")[0].children[0].children;
    let detailList = document.getElementsByClassName("detail-list")[0];

    // Base Building Info
    building.rntName = detailList.children[1].children[0].innerHTML;
    building.name = building.rntName;
    building.rntAddress = detailList.children[5].innerHTML.replace("\n\t\t\t\t\t", "").replace("\t\t\t\t\t", " ").replace("\t\t\n\t\t\t\t", "");
    building.address = building.rntAddress;
    building.constructionDate = {
        year: parseInt(detailList.children[15].innerHTML.split("年")[0]),
        month: parseInt(detailList.children[15].innerHTML.split("年")[1].replace("月", ""))
    }
    building.stories = parseInt(detailList.children[17].innerHTML.replace("地上 ", "").replace("階", ""));

    // Stations
    for (stationContainer of detailList.children[7].children[0].children) {
        let station = new Station();

        station.line = stationContainer.childNodes[0].data.replace("&nbsp;", "");
        station.station = stationContainer.childNodes[1].innerHTML;
        station.distance = parseInt(stationContainer.childNodes[2].data.replace("&nbsp;", "").replace("徒歩", "").replace("分", ""));

        building.stations.push(station);
    }

    // RNT specific info
    building.rntID = String(detailList.children[1].children[0].getAttribute("href").split("/")[3]);
    building.rntEnglishName = document.getElementsByClassName("boxMainHeader detail-header")[0].getElementsByClassName("sub-header")[0].innerHTML.split(" (")[0];
    // googleMapLink NA on this page

    // Apartment Info
    building.apartments[0] = new Apartment();
    building.apartments[0].price = parseMoney(detailBox[0].children[1].innerHTML);
    building.apartments[0].managementFee = parseMoney(detailBox[1].children[1].innerHTML);
    building.floor = parseInt(detailList.children[23].innerHTML.replace("階", ""));
    building.apartments[0].deposit = parseFloat(detailBox[3].children[1].innerHTML.replace("ヶ月", ""));
    if (detailBox[2].children[1].children.length == 1) {
        building.apartments[0].keyMoney = parseFloat(detailBox[2].children[1].children[0].innerHTML);
    } else {
        building.apartments[0].keyMoney = parseFloat(detailBox[2].children[1].innerHTML);
    }
    building.apartments[0].layout = detailBox[4].children[1].innerHTML.split("/")[0].replace("&nbsp;", "")
    building.apartments[0].size = parseFloat(detailBox[4].children[1].innerHTML.split("/")[1].replace("&nbsp;", "").replace("m²", ""));
    building.apartments[0].rntID = String(parseInt(document.location.href.split("/")[5]));

    return building;
}

let coreData = processData();

console.log(coreData);

let usedStations = [];
let unusedStations = [];

for (largeSection of document.getElementsByClassName("search-form")[0].getElementsByClassName("taglink_article route")) {
    for (section of largeSection.getElementsByClassName("checkbox")) {

        let stationName = section.children[1].children[0].innerHTML;
        stationName = stationName.replace("駅", "");
        stationName = stationName.replace("押上", "押上〈スカイツリー前〉");
        stationName = stationName.replace("東京スカイツリー", "押上〈スカイツリー前〉");

        if (coreData.allStations.includes(stationName)) {
            section.children[0].checked = true;
            usedStations.push(stationName);
        } else {
            unusedStations.push(stationName);
        }
    }
}

for (station of coreData.coreData) {
    if (!usedStations.includes(station[1])) {
        console.log(station[1] + " " + station[2]);
    }
}

for (station of coreData.coreData) {
    if (!usedStations.includes(station[1])) {
        for (unusedStation of unusedStations) {
            if (unusedStation.includes(station[1] || station[1].unusedStation)) {
                console.log(station[1] + " " + station[2]);
                console.log(unusedStation);
            }
        }
    }
}

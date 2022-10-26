let coreData = processData();

console.log(coreData);

let usedStations = [];
for(check of document.getElementsByClassName("js-checkSingle js-checkEkiError js-fr-checkSingle")){
    let stationName = check.parentElement.children[1].children[0].innerHTML;

    stationName = stationName.replace("ケ", "ヶ");
    stationName = stationName.replace("明治神宮前", "明治神宮前〈原宿〉");
    stationName = stationName.replace("押上", "押上〈スカイツリー前〉");

    if(coreData.allStations.includes(stationName)){
        check.checked = true;
        usedStations.push(stationName);
    }
}

for(station of coreData.allStations){
    if(!usedStations.includes(station)){
        console.log(station);
    }
}

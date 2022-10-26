let coreData = processData();

console.log(coreData);

let usedLines = [];
for (section of document.getElementsByClassName("tab_switcher_pane active")[0].getElementsByClassName("checkbox")) {
    let lineName = section.children[1].children[0].innerHTML;

    lineName = lineName.replace("京浜東北・根岸線", "JR京浜東北線");
    lineName = lineName.replace("総武・中央線", "JR中央線");
    lineName = lineName.replace("小田急線", "小田急電鉄小田原線");
    lineName = lineName.replace("日暮里舎人ライナー", "日暮里・舎人ライナー");
    lineName = lineName.replace("都営", "都営地下鉄");
    lineName = lineName.replace("東武伊勢崎・大師線", "東武伊勢崎線");
    lineName = lineName.replace("常磐線", "JR常磐線(上野～取手)");
    lineName = lineName.replace("中央本線", "JR中央本線(東京～塩尻)");

    if (coreData.allLines.includes(lineName)) {
        section.children[0].checked = true;
        usedLines.push(lineName);
    } else {
        let jrLineName = "JR" + lineName;
        if (coreData.allLines.includes(jrLineName)) {
            section.children[0].checked = true;
            usedLines.push(jrLineName);
        } else {
            let otherLineName = "東京急行電鉄" + lineName
            if (coreData.allLines.includes(otherLineName)) {
                section.children[0].checked = true;
                usedLines.push(otherLineName);
            }
        }
    }
}

for (line of coreData.allLines) {
    if (!usedLines.includes(line)) {
        console.log(line);
    }
}

// Ignoring JR総武線 as its included
// Cant find 西武池袋線
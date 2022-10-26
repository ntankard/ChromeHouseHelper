let coreData = processData();

console.log(coreData);

let usedLines = [];
for(check of document.getElementsByClassName("js-checkEkiError js-fr-checkSingle")){
    let lineName = check.parentElement.children[1].children[0].innerHTML;
    lineName = lineName.replace("ＪＲ", "JR");
    lineName = lineName.replace("都営", "都営地下鉄");

    lineName = lineName.replace("JR常磐線", "JR常磐線(上野～取手)");
    lineName = lineName.replace("JR総武線快速", "JR総武本線");
    lineName = lineName.replace("新交通ゆりかもめ", "ゆりかもめ");
    lineName = lineName.replace("小田急線", "小田急電鉄小田原線");

    if(coreData.allLines.includes(lineName)){
        check.checked = true;
        usedLines.push(lineName);
    }else{
        lineName = "東京急行電鉄" + lineName;
        if(coreData.allLines.includes(lineName)){
            check.checked = true;
            usedLines.push(lineName);
        }
    }
}

for(line of coreData.allLines){
    if(!usedLines.includes(line)){
        console.log(line);
    }
}

// Ignoring JR中央本線(東京～塩尻) on purpose because we alredy seem to have it?

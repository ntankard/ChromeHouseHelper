let coreData = processData();

console.log(coreData);

for (section of document.getElementsByClassName("boxLeft")[0].getElementsByClassName("boxInner")) {
    for (line of section.getElementsByClassName("boxCheckBox")) {
        let lineName = line.children[1].children[0].innerHTML;
        if(coreData.allLines.includes(lineName)){
           line.children[0].checked = true;
        }
    }
}

for (section of document.getElementsByClassName("boxRight")[0].getElementsByClassName("boxInner")) {
    let lineName = section.children[0].innerHTML;
    for (line of section.getElementsByClassName("boxCheckBox")) {
        let stationName = line.children[1].children[0].innerHTML;
        let index = coreData.allStations.findIndex((element) => stationName == element );
        if(index != -1){
            line.children[0].checked = true;
        }
    }
}






// // 二重橋前  = 国会議事堂前
// // 桜田門 must be selected  but not idea where so removing

// // 市ケ谷 = 市ヶ谷
// // 押上 = 押上〈スカイツリー前〉

// // 霞ケ関 = 霞ヶ関

// // 明治神宮前 = 明治神宮前〈原宿〉

// let coreData = [
//     ["Kanda","神田","Kanda",0,0],
//     ["Mitsukoshimae","三越前","Mitsukoshimae",0,0],
//     ["Shinnihonbashi","新日本橋","Shinnihonbashi",0,0],
//     ["Kanda","秋葉原","Akihabara",5,0],
//     ["Kanda","東京","Tokyo",5,0],
//     ["Mitsukoshimae","日本橋","Nipponbashi",6,0],
//     ["Kanda","御徒町","Okachimachi",7,0],
//     ["Mitsukoshimae","末広町","Suehirocho",7,0],
//     ["Kanda","有楽町","Yurakucho",7,0],
//     ["Mitsukoshimae","京橋","Kyobashi",8,0],
//     ["Kanda","御茶ノ水","Ochanomizu",8,0],
//     ["Mitsukoshimae","水天宮前","Suitengumae",8,0],
//     ["Kanda","上野広小路","Ueno Hirokoji",8,0],
//     ["Kanda","上野","Ueno",9,0],
//     ["Shinnihonbashi","馬喰町","Bakurocho",10,0],
//     ["Mitsukoshimae","銀座","Ginza",10,0],
//     ["Mitsukoshimae","大手町","Otemachi",10,0],
//     ["Kanda","新橋","Shimbashi",10,0],
//     ["Kanda","浜松町","Hamamatsucho",11,0],
//     ["Kanda","岩本町","Iwamotocho",11,0],
//     ["Mitsukoshimae","神保町","Jimbocho",11,0],
//     ["Mitsukoshimae","清澄白河","Kiyosumi Shirakawa",11,0],
//     ["Kanda","仲御徒町","Nakaokachimachi",11,0],
//     ["Mitsukoshimae","上野御徒町","Ueno Okachimachi",11,0],
//     ["Shinnihonbashi","馬喰横山","Bakuroyokoyama",12,0],
//     ["Kanda","日比谷","Hibiya",12,0],
//     ["Mitsukoshimae","九段下","Kudanshita",12,0],
//     ["Kanda","浅草橋","Asakusabashi",12,1],
//     ["Kanda","水道橋","Suidobashi",12,1],
//     ["Kanda","日暮里","Nippori",13,0],
//     ["Kanda","田町","Tamachi",13,0],
//     ["Mitsukoshimae","虎ノ門","Toranomon",13,0],
//     ["Kanda","四ツ谷","Yotsuya",13,0],
//     ["Mitsukoshimae","茅場町","Kayabacho",13,1],
//     ["Mitsukoshimae","宝町","Takaracho",13,1],
//     ["Kanda","京成上野","Keisei Ueno",14,0],
//     ["Shinnihonbashi","錦糸町","Kinshicho",14,0],
//     ["Mitsukoshimae","人形町","Ningyocho",14,0],
//     ["Kanda","西日暮里","Nishinippori",14,0],
//     ["Kanda","新御茶ノ水","Shin-Ochanomizu",14,0],
//     ["Mitsukoshimae","住吉","Sumiyoshi",14,0],
//     ["Mitsukoshimae","東銀座","Higashiginza",14,1],
//     ["Kanda","飯田橋","Iidabashi",14,1],
//     ["Kanda","両国","Ryogoku",14,1],
//     ["Mitsukoshimae","浅草","Asakusa",15,0],
//     ["Kanda","銀座一丁目","Ginza-itchome",15,0],
//     ["Mitsukoshimae","半蔵門","Hanzomon",15,0],
//     ["Shinnihonbashi","東日本橋","Higashi-nihonbashi",15,0],
//     ["Kanda","田端","Tabata",15,0],
//     ["Kanda","高輪ゲートウェイ","Takanawa Gateway",15,0],
//     ["Kanda","淡路町","Awajicho",15,1],
//     ["Kanda","本郷三丁目","Hongo Sanchome",15,1],
//     ["Mitsukoshimae","門前仲町","Monzennakacho",15,1],
//     ["Kanda","市ヶ谷","Ichigaya",16,1],
//     ["Kanda","小伝馬町","Kodenmacho",16,1],
//     ["Kanda","新富町","Shintomicho",16,1],
//     ["Mitsukoshimae","竹橋","Takebashi",16,1],
//     ["Mitsukoshimae","赤坂見附","Akasakamitsuke",17,0],
//     ["Mitsukoshimae","永田町","Nagatacho",17,0],
//     ["Kanda","内幸町","Uchisaiwaicho",17,0],
//     ["Mitsukoshimae","木場","Kiba",17,1],
//     ["Kanda","後楽園","Korakuen",17,1],
//     ["Kanda","大門","Daimon",18,0],
//     ["Kanda","駒込","Komagome",18,0],
//     ["Kanda","小川町","Ogawamachi",18,0],
//     ["Mitsukoshimae","押上〈スカイツリー前〉","Oshiage",18,0],
//     ["Kanda","品川","Shinagawa",18,0],
//     ["Kanda","新宿","Shinjuku",18,0],
//     ["Mitsukoshimae","溜池山王","Tameike Sanno",18,0],
//     ["Kanda","亀戸","Kameido",18,1],
//     ["Mitsukoshimae","霞ヶ関","Kasumigaseki",18,1],
//     ["Kanda","麹町","Kojimachi",18,1],
//     ["Mitsukoshimae","蔵前","Kuramae",18,1],
//     ["Mitsukoshimae","森下","Morishita",18,1],
//     ["Kanda","汐留","Shiodome",18,1],
//     ["Kanda","月島","Tsukishima",18,1],
//     ["Kanda","春日","Kasuga",19,1],
//     ["Kanda","茗荷谷","Myogadani",19,1],
//     ["Mitsukoshimae","東陽町","Toyocho",19,1],
//     ["Mitsukoshimae","青山一丁目","Aoyama-itchome",20,0],
//     ["Kanda","三田","Mita",20,0],
//     ["Kanda","大崎","Osaki",20,0],
//     ["Kanda","巣鴨","Sugamo",20,0],
//     ["Mitsukoshimae","虎ノ門ヒルズ","Toranomon Hills",20,0],
//     ["Mitsukoshimae","八丁堀","Hatchobori",20,1],
//     ["Kanda","平井","Hirai",20,1],
//     ["Mitsukoshimae","六本木一丁目","Roppongi Itchome",20,1],
//     ["Kanda","信濃町","Shinanomachi",20,1],
//     ["Kanda","豊洲","Toyosu",20,1],
//     ["Mitsukoshimae","築地","Tsukiji",20,1],
//     ["Kanda","四谷三丁目","Yotsuya Sanchome",20,1],
//     ["Mitsukoshimae","湯島","Yushima",20,1],
//     ["Mitsukoshimae","外苑前","Gaienmae",21,0],
//     ["Mitsukoshimae","表参道","Omotesando",21,0],
//     ["Kanda","白山","Hakusan",21,1],
//     ["Mitsukoshimae","本所吾妻橋","Honjoazumabashi",21,1],
//     ["Mitsukoshimae","南砂町","Minamisunamachi",21,1],
//     ["Kanda","御成門","Onarimon",21,1],
//     ["Kanda","新大塚","Shin Otsuka",21,1],
//     ["Kanda","竹芝","Takeshiba",21,1],
//     ["Kanda","牛込神楽坂","Ushigome Kagurazaka",21,1],
//     ["Kanda","五反田","Gotanda",22,0],
//     ["Kanda","国会議事堂前","Kokkaigijidomae",22,0],
//     ["Kanda","中野","Nakano",22,0],
//     ["Kanda","大塚","Otsuka",22,0],
//     ["Kanda","泉岳寺","Sengakuji",22,0],
//     ["Mitsukoshimae","麻布十番","Azabu Juban",22,1],
//     ["Shinnihonbashi","浜町","Hamacho",22,1],
//     ["Kanda","日の出","Hinode",22,1],
//     ["Mitsukoshimae","勝どき","Kachidoki",22,1],
//     ["Mitsukoshimae","神楽坂","Kagurazaka",22,1],
//     ["Mitsukoshimae","根津","Nezu",22,1],
//     ["Kanda","千駄ヶ谷","Sendagaya",22,1],
//     ["Kanda","千駄木","Sendagi",22,1],
//     ["Kanda","新宿御苑前","Shinjuku Gyoenmae",22,1],
//     ["Kanda","新宿西口","Shinjuku Nishiguchi",23,0],
//     ["Kanda","江戸川橋","Edogawabashi",23,1],
//     ["Kanda","越中島","Etchujima",23,1],
//     ["Mitsukoshimae","神谷町","Kamiyacho",23,1],
//     ["Kanda","千石","Sengoku",23,1],
//     ["Kanda","芝公園","Shibakoen",23,1],
//     ["Kanda","新宿三丁目","Shinjuku Sanchome",23,1],
//     ["Kanda","新大久保","Shinokubo",23,1],
//     ["Kanda","辰巳","Tatsumi",23,1],
//     ["Kanda","牛込柳町","Ushigome Yanagicho",23,1],
//     ["Kanda","代々木","Yoyogi",23,1],
//     ["Kanda","高円寺","Koenji",24,0],
//     ["Kanda","目黒","Meguro",24,0],
//     ["Shinnihonbashi","西大井","Nishioi",24,0],
//     ["Mitsukoshimae","渋谷","Shibuya",24,0],
//     ["Mitsukoshimae","曙橋","Akebonobashi",24,1],
//     ["Mitsukoshimae","菊川","Kikugawa",24,1],
//     ["Mitsukoshimae","西大島","Nishi Oshima",24,1],
//     ["Kanda","芝浦ふ頭","Shibaurafuto",24,1],
//     ["Mitsukoshimae","白金高輪","Shirokane Takanawa",24,1],
//     ["Mitsukoshimae","高輪台","Takanawadai",24,1],
//     ["Mitsukoshimae","早稲田","Waseda",24,1],
//     ["Kanda","池袋","Ikebukuro",25,0],
//     ["Kanda","高田馬場","Takadanobaba",25,0],
//     ["Kanda","赤羽橋","Akabanebashi",25,1],
//     ["Mitsukoshimae","赤坂","Akasaka",25,1],
//     ["Kanda","原宿","Harajuku",25,1],
//     ["Kanda","大久保","Okubo",25,1],
//     ["Mitsukoshimae","大島","Oshima",25,1],
//     ["Kanda","新木場","Shinkiba",25,1],
//     ["Kanda","東大前","Todaimae",25,1],
//     ["Mitsukoshimae","築地市場","Tsukiji Market",25,1],
//     ["Kanda","若松河田","Wakamatsukawada",25,1],
//     ["Kanda","赤羽","Akabane",26,0],
//     ["Kanda","阿佐ヶ谷","Asagaya",26,0],
//     ["Kanda","護国寺","Gokokuji",26,1],
//     ["Kanda","本駒込","Honkomagome",26,1],
//     ["Kanda","南新宿","Minami-Shinjuku",26,1],
//     ["Kanda","国立競技場","National stadium",26,1],
//     ["Kanda","乃木坂","Nogizaka",26,1],
//     ["Kanda","六本木","Roppongi",26,1],
//     ["Kanda","潮見","Shiomi",26,1],
//     ["Mitsukoshimae","白金台","Shirokanedai",26,1],
//     ["Kanda","亀戸水神","Kameidosuijin",26,2],
//     ["Kanda","品川シーサイド","Shinagawa Seaside",26,2],
//     ["Kanda","恵比寿","Ebisu",27,0],
//     ["Kanda","蒲田","Kamata",27,0],
//     ["Kanda","目白","Mejiro",27,0],
//     ["Kanda","西武新宿","Seibu Shinjuku",27,0],
//     ["Kanda","東中野","Higashi Nakano",27,1],
//     ["Mitsukoshimae","東大島","Higashi Ojima",27,1],
//     ["Kanda","東新宿","Higashi-Shinjuku",27,1],
//     ["Kanda","熊野前","Kumanomae",27,1],
//     ["Kanda","明治神宮前〈原宿〉","Meijijingumae",27,1],
//     ["Kanda","西新宿","Nishi-Shinjuku",27,1],
//     ["Kanda","参宮橋","Sangubashi",27,1],
//     ["Kanda","荻窪","Ogikubo",28,0],
//     ["Kanda","東池袋","Higashi-Ikebukuro",28,1],
//     ["Kanda","北品川","Kitashinagawa",28,1],
//     ["Kanda","大崎広小路","Osaki Hirokoji",28,1],
//     ["Kanda","下神明","Shimoshinmei",28,1],
//     ["Kanda","とうきょうスカイツリー","Tokyo Skytree",28,1],
//     ["Kanda","新豊洲","Shin-Toyosu",28,2],
//     ["Kanda","足立小台","Adachi Odai",29,1],
//     ["Mitsukoshimae","広尾","Hiroo",29,1],
//     ["Kanda","中野坂上","Nakanosakaue",29,1],
//     ["Kanda","笹塚","Sasazuka",29,1],
//     ["Kanda","新馬場","Shinbanba",29,1],
//     ["Kanda","都庁前","Tochomae",29,1],
//     ["Kanda","戸越公園","Togoshikoen",29,1],
//     ["Kanda","代々木八幡","Yoyogihachiman",29,1],
//     ["Kanda","代々木上原","Yoyogiuehara",29,1],
//     ["Kanda","国際展示場","Kokusaitenjijo",29,2],
//     ["Kanda","市場前","Market front",29,2],
//     ["Kanda","西荻窪","Nishiogikubo",30,0],
//     ["Kanda","青物横丁","Aomonoyokocho",30,1],
//     ["Kanda","代田橋","Daitabashi",30,1],
//     ["Kanda","向原","Mukaihara",30,1],
//     ["Mitsukoshimae","落合","Ochiai",30,1],
//     ["Kanda","お台場海浜公園","Odaibakaihinkoen",30,1],
//     ["Kanda","巣鴨新田","Sugamo Nitta",30,1],
//     ["Kanda","戸越銀座","Togoshi Ginza",30,1],
//     ["Kanda","牛田","Ushita",30,1],
// ];

// let names = [
//     "神田",
//     "三越前",
//     "新日本橋",
//     "秋葉原",
//     "東京",
//     "日本橋",
//     "御徒町",
//     "末広町",
//     "有楽町",
//     "京橋",
//     "御茶ノ水",
//     "水天宮前",
//     "上野広小路",
//     "上野",
//     "馬喰町",
//     "銀座",
//     "大手町",
//     "新橋",
//     "浜松町",
//     "岩本町",
//     "神保町",
//     "清澄白河",
//     "仲御徒町",
//     "上野御徒町",
//     "馬喰横山",
//     "日比谷",
//     "九段下",
//     "浅草橋",
//     "水道橋",
//     "日暮里",
//     "田町",
//     "虎ノ門",
//     "四ツ谷",
//     "茅場町",
//     "宝町",
//     "京成上野",
//     "錦糸町",
//     "人形町",
//     "西日暮里",
//     "新御茶ノ水",
//     "住吉",
//     "東銀座",
//     "飯田橋",
//     "両国",
//     "浅草",
//     "銀座一丁目",
//     "半蔵門",
//     "東日本橋",
//     "田端",
//     "高輪ゲートウェイ",
//     "淡路町",
//     "本郷三丁目",
//     "門前仲町",
//     "市ヶ谷",
//     "小伝馬町",
//     "新富町",
//     "竹橋",
//     "赤坂見附",
//     "永田町",
//     "内幸町",
//     "木場",
//     "後楽園",
//     "大門",
//     "駒込",
//     "小川町",
//     "押上〈スカイツリー前〉",
//     "品川",
//     "新宿",
//     "溜池山王",
//     "亀戸",
//     "霞ヶ関",
//     "麹町",
//     "蔵前",
//     "森下",
//     "汐留",
//     "月島",
//     "春日",
//     "茗荷谷",
//     "東陽町",
//     "青山一丁目",
//     "三田",
//     "大崎",
//     "巣鴨",
//     "虎ノ門ヒルズ",
//     "八丁堀",
//     "平井",
//     "六本木一丁目",
//     "信濃町",
//     "豊洲",
//     "築地",
//     "四谷三丁目",
//     "湯島",
//     "外苑前",
//     "表参道",
//     "白山",
//     "本所吾妻橋",
//     "南砂町",
//     "御成門",
//     "新大塚",
//     "竹芝",
//     "牛込神楽坂",
//     "五反田",
//     "国会議事堂前",
//     "中野",
//     "大塚",
//     "泉岳寺",
//     "麻布十番",
//     "浜町",
//     "日の出",
//     "勝どき",
//     "神楽坂",
//     "根津",
//     "千駄ヶ谷",
//     "千駄木",
//     "新宿御苑前",
//     "新宿西口",
//     "江戸川橋",
//     "越中島",
//     "神谷町",
//     "千石",
//     "芝公園",
//     "新宿三丁目",
//     "新大久保",
//     "辰巳",
//     "牛込柳町",
//     "代々木",
//     "高円寺",
//     "目黒",
//     "西大井",
//     "渋谷",
//     "曙橋",
//     "菊川",
//     "西大島",
//     "芝浦ふ頭",
//     "白金高輪",
//     "高輪台",
//     "早稲田",
//     "池袋",
//     "高田馬場",
//     "赤羽橋",
//     "赤坂",
//     "原宿",
//     "大久保",
//     "大島",
//     "新木場",
//     "東大前",
//     "築地市場",
//     "若松河田",
//     "赤羽",
//     "阿佐ヶ谷",
//     "護国寺",
//     "本駒込",
//     "南新宿",
//     "国立競技場",
//     "乃木坂",
//     "六本木",
//     "潮見",
//     "白金台",
//     "亀戸水神",
//     "品川シーサイド",
//     "恵比寿",
//     "蒲田",
//     "目白",
//     "西武新宿",
//     "東中野",
//     "東大島",
//     "東新宿",
//     "熊野前",
//     "明治神宮前〈原宿〉",
//     "西新宿",
//     "参宮橋",
//     "荻窪",
//     "東池袋",
//     "北品川",
//     "大崎広小路",
//     "下神明",
//     "とうきょうスカイツリー",
//     "新豊洲",
//     "足立小台",
//     "広尾",
//     "中野坂上",
//     "笹塚",
//     "新馬場",
//     "都庁前",
//     "戸越公園",
//     "代々木八幡",
//     "代々木上原",
//     "国際展示場",
//     "市場前",
//     "西荻窪",
//     "青物横丁",
//     "代田橋",
//     "向原",
//     "落合",
//     "お台場海浜公園",
//     "巣鴨新田",
//     "戸越銀座",
//     "牛田",
// ];

// console.log(ALL_STATIONS);

// let stations  = Array.apply(null, Array(coreData.length)).map(x => new Array());

// let allStations = [];

// //console.log(coreData);
// //console.log(stations);
// //console.log(names);

// for (section of document.getElementsByClassName("boxRight")[0].getElementsByClassName("boxInner")) {
//     //console.log(section.children[0].innerHTML);

//     let lineName = section.children[0].innerHTML;
//     for (line of section.getElementsByClassName("boxCheckBox")) {
//         let stationName = line.children[1].children[0].innerHTML;
//         //console.log(stationName);
//         let index = names.findIndex((element) => stationName == element );
//        // console.log(index);
//         if(index != -1){
//             line.children[0].checked = true;

//             if(!stations[index].includes(lineName)){
//                 stations[index].push(lineName);
//             }

//             if(!allStations.includes(lineName)){
//                 allStations.push(lineName);
//             }
            
//         }

//         // console.log(line.children[1].children[0].innerHTML);
//         // console.log(line.children[0]);
//        // line.children[0].checked = true;
//     }

// }

// for (section of document.getElementsByClassName("boxLeft")[0].getElementsByClassName("boxInner")) {
//     //console.log(section.children[0]);

//     for (line of section.getElementsByClassName("boxCheckBox")) {
//         let lineName = line.children[1].children[0].innerHTML;
//         if(allStations.includes(lineName)){
//            //line.children[0].checked = true;
//         }
//         // console.log(line.children[1].children[0].innerHTML);
//         //console.log(line.children[0]);
//         line.children[0].checked = true;
//     }

// }

// // for(let i=0;i<names.length;i++){
// //     if(stations[i].length ==0){
// //            console.log(coreData[i]); 
// //     }

// // }

// // todo check for empty station list

// // console.log(stations);
// // console.log(allStations);

// let totalString = "";
// for(let i=0;i<names.length;i++){
//     //console.log(coreData[i]);

//     totalString += '["' +  coreData[i][0] + '","'+  coreData[i][1] + '","'+  coreData[i][2] + '",'+  coreData[i][3] + ','+  coreData[i][4];

//     totalString += ',['
//     for(let line of stations[i]){
//         //console.log(line);
//         totalString += '"' + line + '",';
//     }
//     totalString += ']'

//     totalString += "],\n";
// }

// console.log(totalString);


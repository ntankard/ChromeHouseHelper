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
    let section = lineStation[1].split(" 歩");
    if (section.length != 2) {
        return; // This happen in the case where distance by car is listed
    }
    station.station = section[0];
    station.distance = parseFloat(section[1].split("(")[0].replace("分", ""));
    return station;
}

/**
 * Convert the age string into a number
 * @param {*} age The number to convert
 * @returns The float version
 */
function extractAge(age) {
    if (age == "新") {
        return 0.0;
    }
    return parseFloat(age);
}

/**
 * Extract relevant information from a suumo apartment URL
 * @param {String} url The URL string
 * @returns The extracted parts of the URL
 */
function processSuumoURL(url) {
    let aptId;
    let baseUrl;
    let aptType;

    let jcn = url.split("jnc_");
    if (jcn.length == 2) {
        aptId = jcn[1].split("/")[0];
        baseUrl = jcn[0];

        if (jcn[1].includes("kankyo")) {
            aptType = 0;
        } else {
            aptType = 1;
        }
    } else {
        let bc = url.split("bc_");
        if (bc.length == 2) {
            let links = document.getElementById("help_link").getElementsByClassName("left_column")[0].children[0].children;
            aptId = links[links.length - 2].innerHTML.split("jnc_")[1].split("/")[0];
            baseUrl = bc[0];

            if (bc[1].includes("kankyo")) {
                aptType = 2;
            } else {
                aptType = 3;
            }
        } else {
            throw "Invalid page type";
        }
    }

    return {
        baseURL: baseUrl,
        suumoID: aptId,
        aptType: aptType,
    };
}

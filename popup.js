// LOCAL DATA ==========================================================================================================

// Buttons
let saveBtn = document.getElementById('btnSave')
let goodBtn = document.getElementById('btnGood')
let badBtn = document.getElementById('btnBad')
let badBuildingBtn = document.getElementById('btnBadBuilding')

// Data display
let pageType = document.getElementById('pageType');
let databaseStatus = document.getElementById('databaseStatus');
let monthlyCost = document.getElementById('monthlyCost');
let moveInCost = document.getElementById('moveInCost');
let totalMonthlyCost = document.getElementById('totalMonthlyCost');

// Inputs
let commentText = document.getElementById('commentText');

// Local data
let rawBuilding;
let building;
let apartmentID;
let page;


// MAIN CODE ===========================================================================================================

// Communicate with the content page to get the data
// TODO this is a problem because we are doing everything on the call back, we need to find out how to do a blocking call here
chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (!tabs[0].url.includes('https://suumo.jp')) {
        alert('please go to https://suumo.jp/');
        return;
    }
    findPageType(tabs);
});

// FUNCTIONS ===========================================================================================================

/**
 * Continue to query the tab until the page type is returned (has the effect of waiting for load)
 * @param {*} tabs The tab to communicate with
 */
function findPageType(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { type: "getPageType" }, function (response) {
        if (response) {
            page = response;
            processPageType(tabs);
        } else {
            setTimeout(function () {
                findPageType(tabs);
            }, 100);
        }
    });
}

/**
 * Load the popup based on the type of page its attached to
 * @param {*} tabs The tabs to talk to to get building information if needed
 * @returns 
 */
function processPageType(tabs) {
    switch (page) {
        case "Apartment_1":
        case "Apartment_2":
            pageType.value = "Apartment";
            loadApartment(tabs)
            return;
        case "Search":
            pageType.value = "Search";
            break;
        default:
            pageType.value = "Unknown";
    }

    loadNoApartment();
}

/**
 * Linked to a non Apartment page so disable interaction and enable only site wide functions
 */
function loadNoApartment() {

}

/**
 * An apartment page has been loaded. Get the details, populate the pop up and enable functionality
 * @param {*} tabs  The tabs to talk to
 */
async function loadApartment(tabs) {
    let response = await syncSendMessage(tabs[0].id, { type: "getApartment" });

    if (response) {
        rawBuilding = response;
        console.log("response")
        console.log(response)
        let matchResult = await findMatchSingleApartment(rawBuilding);

        console.log("Match results");
        console.log(matchResult);

        if (matchResult.matchType == "Full") {
            building = matchResult.building;
            apartmentID = matchResult.apartmentID;
            databaseStatus.value = "Full Match";
        } else {
            building = rawBuilding;
            apartmentID = 0;
            databaseStatus.value = "New, not saved";
        }
        populateData();
    } else {
        alert("No building data received");
        return;
    }

    // Attach listeners
    saveBtn.addEventListener('click', saveAction);
    goodBtn.addEventListener('click', goodAction);
    badBtn.addEventListener('click', badAction);
    badBuildingBtn.addEventListener('click', badBuildingAction);

    saveBtn.disabled = false;
    goodBtn.disabled = false;
    badBtn.disabled = false;
    badBuildingBtn.disabled = false;
}

/**
 * Fill out the panel based on the apartment data
 */
function populateData() {
    monthlyCost.value = building.apartments[apartmentID].price + building.apartments[apartmentID].managementFee;
    moveInCost.value = building.apartments[apartmentID].keyMoney;
    totalMonthlyCost.value = (building.apartments[apartmentID].price + building.apartments[apartmentID].managementFee) + (building.apartments[apartmentID].keyMoney / 24)
}

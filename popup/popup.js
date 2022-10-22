// LOCAL DATA ==========================================================================================================

// Buttons
let saveBtn = document.getElementById('btnSave');
let goodBtn = document.getElementById('btnGood');
let badBtn = document.getElementById('btnBad');
let badBuildingBtn = document.getElementById('btnBadBuilding');
let exportBtn = document.getElementById('btnExport');
let resetBtn = document.getElementById('btnReset');

// Data display
let pageType = document.getElementById('pageType');
let databaseStatus = document.getElementById('databaseStatus');
let monthlyCost = document.getElementById('monthlyCost');
let moveInCost = document.getElementById('moveInCost');
let totalMonthlyCost = document.getElementById('totalMonthlyCost');
let buildingStatus = document.getElementById('buildingStatus');
let apartmentStatus = document.getElementById('apartmentStatus');

// Inputs
let commentText = document.getElementById('commentText');

// Local data
let rawBuilding;
let databaseMatch;
let apartmentID;

// MAIN CODE ===========================================================================================================

exportBtn.addEventListener('click', exportAction);
resetBtn.addEventListener('click', resetAction);

// Communicate with the content page to get the data
// TODO this is a problem because we are doing everything on the call back, we need to find out how to do a blocking call here
loadPopup();

// FUNCTIONS ===========================================================================================================

/**
 * Render the popup
 */
function loadPopup() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        findPageType(tabs);
    });
}

/**
 * Continue to query the tab until the page type is returned (has the effect of waiting for load)
 * @param {*} tabs The tab to communicate with
 */
function findPageType(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { type: REQUEST_PAGE_TYPE }, function (response) {
        console.log(response)
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
        case PAGE_TYPE_APARTMENT:
            pageType.value = PAGE_TYPE_APARTMENT;
            loadApartment(tabs)
            return;
        case PAGE_TYPE_SEARCH:
            pageType.value = PAGE_TYPE_SEARCH;
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

    // Get the apartment to render
    rawBuilding = await syncSendMessage(tabs[0].id, { type: REQUEST_PAGE_APARTMENT });
    if (rawBuilding) {
        console.log("Received Apartment");
        console.log(rawBuilding);

        // Check for a database match
        let totalResult = await findBuilding(rawBuilding);
        console.log("From Database");
        console.log(totalResult);

        building = totalResult.building;
        console.log("Mapping");
        console.log(totalResult.apartmentMapping);
        if (totalResult.apartmentMapping != null) {
            if (totalResult.apartmentMapping[0] == -1) {
                apartmentID = building.apartments.length - 1;
            } else {
                apartmentID = totalResult.apartmentMapping[0];
            }

        } else {
            apartmentID = 0;
        }

        // Data collection complete, populate data.
        populateData();

        // Attach listeners
        goodBtn.addEventListener('click', goodAction);
        badBtn.addEventListener('click', badAction);
        badBuildingBtn.addEventListener('click', badBuildingAction);

        goodBtn.disabled = false;
        badBtn.disabled = false;
        badBuildingBtn.disabled = false;

    } else {
        alert("No building data received");
        return;
    }

}

function apartment() {
    return building.apartments[apartmentID];
}

/**
 * Fill out the panel based on the apartment data
 */
function populateData() {
    var formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'JPY',

        // These options are needed to round to whole numbers if that's what you want.
        //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
        //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
    });

    console.log(building);
    console.log(apartmentID);

    if (building.databaseID == -1) {
        databaseStatus.value = "NEW BUILDING";
    } else {
        if (apartment().databaseID == -1) {
            databaseStatus.value = "NEW APARTMENT";
        } else {
            databaseStatus.value = "KNOWN";
        }
    }

    monthlyCost.value = formatter.format(apartment().price + apartment().managementFee);
    moveInCost.value = formatter.format(apartment().keyMoney);
    totalMonthlyCost.value = formatter.format((apartment().price + apartment().managementFee) + (apartment().keyMoney / 24));
    buildingStatus.value = building.status;
    apartmentStatus.value = apartment().status;
}

/**
 * goodAction action listener
 */
function goodAction() {
    building.apartments[apartmentID].status = "GOOD";
    updateRecord();
}

/**
 * badAction action listener
 */
function badAction() {
    building.apartments[apartmentID].status = "BAD";
    updateRecord();
}

/**
 * badBuildingBtn action listener
 */
function badBuildingAction() {
    building.status = "BAD";
    updateRecord();
}

/**
 * exportBtn action listener
 */
function exportAction() {
    exportDatabase();
    // exportMap();
    // exportRntApartmentMap();
    // exportRntBuildingMap();
}

/**
 * resetBtn action listener
 */
function resetAction() {
    try {
        exportDatabase();
    } catch (e) {

    }
    resetDatabase();
}

/**
 * Sync the popup data to the database and reload everything
 */
function updateRecord() {
    saveBuilding(building);
    loadPopup();
}

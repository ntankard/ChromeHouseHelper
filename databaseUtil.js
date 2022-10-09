// PUBLIC ==============================================================================================================

/**
 * Erase all data in the database. The existing data will be exported first if posable
 */
async function resetDatabase() {
    saveDatabase(new FullData());
}

/**
 * Find a matching building in the database
 * @param {*} rawBuilding The building to search for
 * @returns The database entry updated with data from rawBuilding, or rawBuilding as well as a mapping from the apartments on the entry to the ones in the database
 */
async function findBuilding(rawBuilding) {
    // Save a blank database
    // saveDatabase(new FullData());

    // Load the database
    let database = await loadDatabase();

    // See if this building is in the database
    let result = n_findBuilding(rawBuilding, database);
    if (result == null) {
        return {
            building: rawBuilding,
            apartmentMapping: null
        };
    }

    // If it is, merge the 2 sources
    let mapping = n_mergeBuilding(result, rawBuilding);
    return {
        building: result,
        apartmentMapping: mapping
    };
}

/**
 * Save a building into the database. New or updated
 * @param {Building} updatedBuilding Te building to save
 */
async function saveBuilding(updatedBuilding) {
    let database = await loadDatabase();
    n_mergeIntoDatabase(updatedBuilding, database);
    saveDatabase(database);
}

/**
 * Save the entire database as a JSon file
 */
async function exportDatabase() {
    let database = await loadDatabase();
    var _myArray = JSON.stringify(database.coreData, null, 4); //indentation in json format, human readable

    var d = new Date();
    var vLink = document.createElement('a'),
        vBlob = new Blob([_myArray], { type: "octet/stream" }),
        vName = 'all_apartments_' + d.toJSON() + '.json',
        vUrl = window.URL.createObjectURL(vBlob);
    vLink.setAttribute('href', vUrl);
    vLink.setAttribute('download', vName);
    vLink.click();
}

/**
 * Save the suumo ID map as a JSon file
 */
async function exportMap() {
    let database = await loadDatabase();
    var _myArray = JSON.stringify(Object.fromEntries(database.suumoIDMap), null, 4); //indentation in json format, human readable

    var d = new Date();
    var vLink = document.createElement('a'),
        vBlob = new Blob([_myArray], { type: "octet/stream" }),
        vName = 'all_apartments_map_' + d.toJSON() + '.json',
        vUrl = window.URL.createObjectURL(vBlob);
    vLink.setAttribute('href', vUrl);
    vLink.setAttribute('download', vName);
    vLink.click();
}

// PRIVATE =============================================================================================================

/**
 * Load the FullData object
 * @returns The loaded FullData
 */
async function loadDatabase() {
    let coreData = await syncStorageLocalGet("FullData_CoreData");
    let suumoIDMap = await syncStorageLocalGet("FullData_SuumoIDMap");
    let fullData = new FullData();
    fullData.coreData = coreData;
    fullData.suumoIDMap = new Map(Object.entries(suumoIDMap));
    if (!n_validateDatabase(fullData)) {
        throw "Core database is corrupt, reset needed";
    }
    return fullData;
}

/**
 * Save the FullData object
 * @param {FullData} database The database to save
 */
async function saveDatabase(database) {
    if (!n_validateDatabase(database)) {
        throw "Can't save corrupt database";
    }
    let saveData = Object.fromEntries(database.suumoIDMap);
    chrome.storage.local.set({ "FullData_CoreData": database.coreData });
    chrome.storage.local.set({ "FullData_SuumoIDMap": saveData });
}

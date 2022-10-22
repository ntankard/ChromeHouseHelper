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
    let database = await loadDatabase(false);
    exportDatabase(database);
}

/**
 * Save the suumo ID map as a JSon file
 */
async function exportSuumoMap() {
    let database = await loadDatabase();
    exportSuumoMap_Impl(database);
}

/**
 * Save the suumo ID map as a JSon file
 */
async function exportRntApartmentMap() {
    let database = await loadDatabase();
    exportRntApartmentMap_Impl(database);
}

/**
 * Save the suumo ID map as a JSon file
 */
async function exportRntBuildingMap() {
    let database = await loadDatabase();
    exportRntBuildingMap_Impl(database);
}

// PRIVATE =============================================================================================================

/**
 * Export all saved data
 * @param {*} database The data to export
 */
async function expertAll_Impl(database) {
    exportDatabase(database);
    exportSuumoMap_Impl(database);
    exportRntApartmentMap_Impl(database);
    exportRntBuildingMap_Impl(database);
}

/**
 * Save the entire database as a JSon file
 */
async function exportDatabase(database) {
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
function exportSuumoMap_Impl(database) {
    var _myArray = JSON.stringify(Object.fromEntries(database.suumoIDMap), null, 4); //indentation in json format, human readable

    var d = new Date();
    var vLink = document.createElement('a'),
        vBlob = new Blob([_myArray], { type: "octet/stream" }),
        vName = 'suumo_map_' + d.toJSON() + '.json',
        vUrl = window.URL.createObjectURL(vBlob);
    vLink.setAttribute('href', vUrl);
    vLink.setAttribute('download', vName);
    vLink.click();
}

/**
 * Save the suumo ID map as a JSon file
 */
function exportRntApartmentMap_Impl(database) {
    var _myArray = JSON.stringify(Object.fromEntries(database.rntApartmentIDMap), null, 4); //indentation in json format, human readable

    var d = new Date();
    var vLink = document.createElement('a'),
        vBlob = new Blob([_myArray], { type: "octet/stream" }),
        vName = 'rnt_apartment_map_' + d.toJSON() + '.json',
        vUrl = window.URL.createObjectURL(vBlob);
    vLink.setAttribute('href', vUrl);
    vLink.setAttribute('download', vName);
    vLink.click();
}

/**
 * Save the suumo ID map as a JSon file
 */
function exportRntBuildingMap_Impl(database) {
    var _myArray = JSON.stringify(Object.fromEntries(database.rntBuildingIDMap), null, 4); //indentation in json format, human readable

    var d = new Date();
    var vLink = document.createElement('a'),
        vBlob = new Blob([_myArray], { type: "octet/stream" }),
        vName = 'rnt_building_map_' + d.toJSON() + '.json',
        vUrl = window.URL.createObjectURL(vBlob);
    vLink.setAttribute('href', vUrl);
    vLink.setAttribute('download', vName);
    vLink.click();
}

/**
 * Load the FullData object
 * @returns The loaded FullData
 */
async function loadDatabase() {
    return loadDatabase(true);
}

async function loadDatabase(doCheck) {
    let coreData = await syncStorageLocalGet("FullData_CoreData");
    let suumoIDMap = await syncStorageLocalGet("FullData_SuumoIDMap");
    let rntApartmentIDMap = await syncStorageLocalGet("FullData_RntApartmentIDMap");
    let rntBuildingIDMap = await syncStorageLocalGet("FullData_RntBuildingIDMap");
    let fullData = new FullData();

    fullData.coreData = coreData;
    fullData.suumoIDMap = new Map(Object.entries(suumoIDMap));
    fullData.rntApartmentIDMap = new Map(Object.entries(rntApartmentIDMap));
    fullData.rntBuildingIDMap = new Map(Object.entries(rntBuildingIDMap));
    if (doCheck && !n_validateDatabase(fullData)) {
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
        expertAll_Impl(database);
        throw "Can't save corrupt database";
    }
    let suumoIDMap = Object.fromEntries(database.suumoIDMap);
    let rntApartmentIDMap = Object.fromEntries(database.rntApartmentIDMap);
    let rntBuildingIDMap = Object.fromEntries(database.rntBuildingIDMap);
    chrome.storage.local.set({ "FullData_CoreData": database.coreData });
    chrome.storage.local.set({ "FullData_SuumoIDMap": suumoIDMap });
    chrome.storage.local.set({ "FullData_RntApartmentIDMap": rntApartmentIDMap });
    chrome.storage.local.set({ "FullData_RntBuildingIDMap": rntBuildingIDMap });
}

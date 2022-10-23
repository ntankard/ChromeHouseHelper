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
    exportDatabase_Impl(database);
}

/**
 * Save the suumo ID map as a JSon file
 */
async function exportApartmentMap() {
    let database = await loadDatabase();
    exportApartmentMap_Impl(database);
}

/**
 * Save the suumo ID map as a JSon file
 */
async function exportBuildingMap() {
    let database = await loadDatabase();
    exportBuildingMap_Impl(database);
}

// PRIVATE =============================================================================================================

/**
 * Export all saved data
 * @param {*} database The data to export
 */
async function expertAll_Impl(database) {
    exportDatabase_Impl(database);
    exportApartmentMap_Impl(database);
    exportBuildingMap_Impl(database);
}

/**
 * Save the entire database as a JSon file
 */
async function exportDatabase_Impl(database) {
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
function exportApartmentMap_Impl(database) {
    var _myArray = JSON.stringify(n_idMapsToJson(database.apartmentIDMaps), null, 4); //indentation in json format, human readable

    var d = new Date();
    var vLink = document.createElement('a'),
        vBlob = new Blob([_myArray], { type: "octet/stream" }),
        vName = 'apartment_map_' + d.toJSON() + '.json',
        vUrl = window.URL.createObjectURL(vBlob);
    vLink.setAttribute('href', vUrl);
    vLink.setAttribute('download', vName);
    vLink.click();
}

/**
 * Save the suumo ID map as a JSon file
 */
function exportBuildingMap_Impl(database) {
    var _myArray = JSON.stringify(n_idMapsToJson(database.buildingIDMaps), null, 4); //indentation in json format, human readable

    var d = new Date();
    var vLink = document.createElement('a'),
        vBlob = new Blob([_myArray], { type: "octet/stream" }),
        vName = 'building_map_' + d.toJSON() + '.json',
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

/**
 * Load the FullData object
 * @param {*} doCheck True of this should throw if the database is invalid
 * @returns The loaded FullData
 */
async function loadDatabase(doCheck) {
    let coreData = await syncStorageLocalGet("FullData_CoreData");
    let apartments = await syncStorageLocalGet("FullData_apartmentIDMaps");
    let buildings = await syncStorageLocalGet("FullData_buildingIDMaps");

    let fullData = new FullData();
    fullData.coreData = coreData;
    fullData.apartmentIDMaps = n_jsonToIDMaps(apartments);
    fullData.buildingIDMaps = n_jsonToIDMaps(buildings);
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
    let apartments = n_idMapsToJson(database.apartmentIDMaps)
    let buildingIDMaps = n_idMapsToJson(database.buildingIDMaps)
    chrome.storage.local.set({ "FullData_CoreData": database.coreData });
    chrome.storage.local.set({ "FullData_apartmentIDMaps": apartments });
    chrome.storage.local.set({ "FullData_buildingIDMaps": buildingIDMaps });
}

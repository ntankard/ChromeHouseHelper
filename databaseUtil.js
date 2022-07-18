/**
 * Based on a single apartment building, find a match in the database
 * @param {*} rawBuilding The building object to find
 * @returns A match if one is found
 */
async function findMatchSingleApartment(rawBuilding) {
    let database = await syncStorageLocalGet('AllBuildings');

    for (building of database) {
        console.log(rawBuilding.apartments)
        for (rawApartment of rawBuilding.apartments) {
            for (url of rawApartment.urls) {
                for (apartment of building.apartments) {
                    if (apartment.urls.includes(url)) {
                        return {
                            matchType: "Full",
                            buildingID: database.indexOf(building),
                            building: building,
                            apartmentID: building.apartments.indexOf(apartment),
                            apartment: apartment
                        }
                    }
                }
            }
        }
    }
    return { matchType: "None" };
}

/**
 * Add a completely new building to the database
 * @param {*} rawBuilding The building to add
 */
async function addNewBuilding(rawBuilding) {
    let database = await syncStorageLocalGet('AllBuildings');
    database.push(rawBuilding);
    chrome.storage.local.set({ 'AllBuildings': database });
}

/**
 * Update an individual apartment in a building (can not be used to add a new apartment to a know building)
 * @param {*} building The building containing the apartment to update (other apartments will be ignored)
 * @param {*} buildingID The ID of this building in the database
 * @param {*} apartmentID The ID of the apartment to update in the building and database
 */
async function updateApartment(building, buildingID, apartmentID) {
    let database = await syncStorageLocalGet('AllBuildings');
    database.splice(database.indexOf(buildingID), 1, mergeApartment(database, buildingID, building, apartmentID));
    chrome.storage.local.set({ 'AllBuildings': database });
}

/**
 * Merge a single apartment and its parent building with the record in the database. Building data will be merged too
 * @param {*} database The database record  
 * @param {*} buildingID The building ID to merge
 * @param {*} building The building object with the new data
 * @param {*} apartmentID The apartment ID to merge
 * @returns The new combined object
 */
function mergeApartment(database, buildingID, building, apartmentID) {
    let combinedBuilding = database[buildingID];
    combinedBuilding.status = building.status;
    combinedBuilding.apartments.splice(combinedBuilding.apartments.indexOf(buildingID), 1, building.apartments[apartmentID]);
    return combinedBuilding;
}

/**
 * Save the entire database as a JSon file
 */
async function exportDatabase() {
    let database = await syncStorageLocalGet('AllBuildings');
    var _myArray = JSON.stringify(database, null, 4); //indentation in json format, human readable

    var vLink = document.createElement('a'),
        vBlob = new Blob([_myArray], { type: "octet/stream" }),
        vName = 'all_apartments.json',
        vUrl = window.URL.createObjectURL(vBlob);
    vLink.setAttribute('href', vUrl);
    vLink.setAttribute('download', vName);
    vLink.click();
}

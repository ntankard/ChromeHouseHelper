// CONST ===============================================================================================================

const SIMILARLY_TYPE_ID_MATCH = 3; // Some attributes are different in a compatible way but there is an ID match
const SIMILARLY_TYPE_POSSIBLE_MATCH = 2; // Enough attributes are the same that a match is probable
const SIMILARLY_TYPE_COMPATIBLE = 1; // The attributes could below to the same object but there is not enough data to determine a match
const SIMILARLY_TYPE_MISMATCH = 0; // At least 1 attribute is different in an incompatible way 

const SITE_SUUMO = 0;
const SITE_RNT = 1;

// PUBLIC ==============================================================================================================

function n_mergeIntoDatabase(updatedBuilding, database) {
    // New Building
    let toUpdate;
    if (updatedBuilding.databaseID == -1) {
        toUpdate = updatedBuilding;
        updatedBuilding.databaseID = database.coreData.length;
        database.coreData.push(updatedBuilding);
    } else {
        toUpdate = database.coreData[updatedBuilding.databaseID];
        n_mergeBuilding(database.coreData[updatedBuilding.databaseID], updatedBuilding);
    }

    // Update station IDs
    for (let i = 0; i < toUpdate.stations.length; i++) {
        if (toUpdate.stations[i].databaseID != -1 && toUpdate.stations[i].databaseID != i) {
            throw "Database corruption";
        }
        toUpdate.stations[i].databaseID = i;
    }

    // Update apartment IDs
    for (let i = 0; i < toUpdate.apartments.length; i++) {
        if (toUpdate.apartments[i].databaseID != -1 && toUpdate.apartments[i].databaseID != i) {
            throw "Database corruption";
        }
        toUpdate.apartments[i].databaseID = i;
    }

    // Update map if new data is present
    if (toUpdate.IDs[SITE_RNT] != null) {
        if (!database.buildingIDMaps[SITE_RNT].has(toUpdate.IDs[SITE_RNT])) {
            database.buildingIDMaps[SITE_RNT].set(toUpdate.IDs[SITE_RNT], { buildingID: toUpdate.databaseID });
        }
    }
    for (let apartment of toUpdate.apartments) {
        if (apartment.IDs[SITE_SUUMO] != null) {
            if (!database.apartmentIDMaps[SITE_SUUMO].has(apartment.IDs[SITE_SUUMO])) {
                database.apartmentIDMaps[SITE_SUUMO].set(apartment.IDs[SITE_SUUMO], { buildingID: toUpdate.databaseID, apartmentID: apartment.databaseID });
            }
        }
        if (apartment.IDs[SITE_RNT] != null) {
            if (!database.apartmentIDMaps[SITE_RNT].has(apartment.IDs[SITE_RNT])) {
                database.apartmentIDMaps[SITE_RNT].set(apartment.IDs[SITE_RNT], { buildingID: toUpdate.databaseID, apartmentID: apartment.databaseID });
            }
        }
    }

    database.coreData[updatedBuilding.databaseID] = toUpdate;
}

/**
 * Update a building with info from another (includes apartment and station)
 * @param {Building} storedBuilding The building to update
 * @param {Building} nonStoredBuilding The source of new data
 * @returns The map between the apartments in the nonStoredBuilding and in the new storedBuilding
 */
function n_mergeBuilding(storedBuilding, nonStoredBuilding) {
    let result = n_compareFullBuilding(storedBuilding, nonStoredBuilding);
    if (result.similarity == SIMILARLY_TYPE_MISMATCH) {
        console.log("Stored");
        console.log(storedBuilding);
        console.log("ToAdd");
        console.log(nonStoredBuilding);
        throw "Trying to merge incompatible buildings";
    }

    if (nonStoredBuilding.status != null) {
        storedBuilding.status = nonStoredBuilding.status;
    }

    if (storedBuilding.name == null) {
        storedBuilding.name = nonStoredBuilding.name;
    }
    if (storedBuilding.address == null) {
        storedBuilding.address = nonStoredBuilding.address;
    }
    if (storedBuilding.age == null) {
        storedBuilding.age = nonStoredBuilding.age;
    }
    if (storedBuilding.stories == null) {
        storedBuilding.stories = nonStoredBuilding.stories;
    }

    let matchIDs = Array(nonStoredBuilding.apartments.length).fill(-1);
    let usedIDs = [];
    for (let i = 0; i < nonStoredBuilding.apartments.length; i++) {
        let databaseID = nonStoredBuilding.apartments[i].databaseID;
        if (databaseID != -1) {
            if (databaseID >= storedBuilding.apartments.length) {
                throw "Impossible apartment ID match";
            }
            matchIDs[i] = databaseID;
            usedIDs.push(databaseID);
        }
    }
    let apartmentResult = n_findApartmentMappingLevel(storedBuilding.apartments, nonStoredBuilding.apartments, SIMILARLY_TYPE_POSSIBLE_MATCH, matchIDs, usedIDs);
    if (!apartmentResult.identical) {
        for (let i = 0; i < nonStoredBuilding.apartments.length; i++) {
            if (matchIDs[i] == -1) {
                storedBuilding.apartments.push(nonStoredBuilding.apartments[i]);
            } else {
                n_mergeApartment(storedBuilding.apartments[matchIDs[i]], nonStoredBuilding.apartments[i]);
            }
        }
    }

    let stationMatchIDs = Array(nonStoredBuilding.stations.length).fill(-1);
    let stationUsedIDs = [];
    for (let i = 0; i < nonStoredBuilding.stations.length; i++) {
        let databaseID = nonStoredBuilding.stations[i].databaseID;
        if (databaseID != -1) {
            if (databaseID >= storedBuilding.stations.length) {
                throw "Impossible station ID match";
            }
            stationMatchIDs[i] = databaseID;
            stationUsedIDs.push(databaseID);
        }
    }
    let stationsResult = n_compareStations(storedBuilding.stations, nonStoredBuilding.stations, stationMatchIDs, stationUsedIDs);
    if (!stationsResult.identical) {
        for (let i = 0; i < nonStoredBuilding.stations.length; i++) {
            if (stationMatchIDs[i] == -1) {
                storedBuilding.stations.push(nonStoredBuilding.stations[i]);
            } else {
                // May need to merge in the future if new data is present
            }
        }
    }

    return matchIDs;
}

/**
 * Validate the database entry. Confirms database IDs and map entires are correct
 * @param {*} database 
 * @returns 
 */
function n_validateDatabase(database) {
    let suumoMapCount = 0;
    let rntAMapCount = 0;
    let rntBMapCount = 0;
    for (let i = 0; i < database.coreData.length; i++) {
        if (database.coreData[i].databaseID != i) {
            // console.log("0");
            return false;
        }
        if (database.coreData[i].IDs[SITE_RNT] != null) {
            let mapResult = database.buildingIDMaps[SITE_RNT].get(database.coreData[i].IDs[SITE_RNT]);
            if ((mapResult == undefined) || (mapResult.buildingID != i)) {
                // console.log("1");
                return false;
            }
            rntBMapCount++;
        }
        for (let j = 0; j < database.coreData[i].apartments.length; j++) {
            if (database.coreData[i].apartments[j].databaseID != j) {
                // console.log("2");
                return false;
            }
            if (database.coreData[i].apartments[j].IDs[SITE_SUUMO] != null) {
                let mapResult = database.apartmentIDMaps[SITE_SUUMO].get(database.coreData[i].apartments[j].IDs[SITE_SUUMO]);
                if ((mapResult == undefined) || (mapResult.buildingID != i) || (mapResult.apartmentID != j)) {
                    // console.log("4");
                    return false;
                }
                suumoMapCount++;
            }
            if (database.coreData[i].apartments[j].IDs[SITE_RNT] != null) {
                let mapResult = database.apartmentIDMaps[SITE_RNT].get(database.coreData[i].apartments[j].IDs[SITE_RNT]);
                if ((mapResult == undefined) || (mapResult.buildingID != i) || (mapResult.apartmentID != j)) {
                    // console.log("5");
                    return false;
                }
                rntAMapCount++;
            }
        }
    }
    if (suumoMapCount != database.apartmentIDMaps[SITE_SUUMO].size) {
        // console.log("6");
        return false;
    }
    if (rntAMapCount != database.apartmentIDMaps[SITE_RNT].size) {
        // console.log("7");
        return false;
    }
    if (rntBMapCount != database.buildingIDMaps[SITE_RNT].size) {
        // console.log("8");
        return false;
    }
    return true;
}

/**
 * Find this building in the database (no merge is done here, only the raw database entry is returned)
 * @param {*} nonStoredBuilding The building to find
 * @param {*} database The database to search
 * @returns The found building or null
 */
function n_findBuilding(nonStoredBuilding, database) {
    // Find an existing building
    if (nonStoredBuilding.databaseID != -1) { // Database ID was provided
        return database.coreData[nonStoredBuilding.databaseID];
    } else {
        // First attempt to find the match based on the unique IDs of the children
        let foundID = -2;
        let match = database.buildingIDMaps[SITE_RNT].get((nonStoredBuilding.IDs[SITE_RNT]));
        if (match != null) {
            foundID = match.buildingID;
        }
        for (let apartment of nonStoredBuilding.apartments) {
            if (apartment.IDs[SITE_SUUMO]) {
                match = null;
                match = database.apartmentIDMaps[SITE_SUUMO].get((apartment.IDs[SITE_SUUMO]));
                if (match != null) {
                    if (foundID >= 0 && foundID != match.buildingID) {
                        throw "Multiple suumo buildings found in 1 entry "
                    }
                    foundID = match.buildingID;
                }
                match = null;
                match = database.apartmentIDMaps[SITE_RNT].get((apartment.rnt));
                if (match != null) {
                    if (foundID >= 0 && foundID != match.buildingID) {
                        throw "Multiple rnt buildings found in 1 entry "
                    }
                    foundID = match.buildingID;
                }
            }
        }
        if (foundID >= 0) {
            return database.coreData[foundID];
        }
    }

    // ID match failed, last resort slow entry by entry comparison
    for (let building of database.coreData) {
        if (n_compareBuilding(building, nonStoredBuilding).similarity >= SIMILARLY_TYPE_POSSIBLE_MATCH) {
            return building;
        }
    }

    return null;
}

/**
 * Compare 2 buildings including there apartments. ID matches in the apartments are elevated to ID match for the building 
 * @param {Building} storedBuilding 
 * @param {Building} nonStoredBuilding 
 * @returns similarity: The similarity of the building, identical if the buildings and apartments are the same
 */
function n_compareFullBuilding(storedBuilding, nonStoredBuilding) {
    // Check the base building data's similarity
    let buildingMatch = n_compareBuilding(storedBuilding, nonStoredBuilding);
    if (buildingMatch.similarity == SIMILARLY_TYPE_MISMATCH) {
        return {
            similarity: SIMILARLY_TYPE_MISMATCH,
            identical: false
        };
    }

    // Check the similarity of all apartments
    let matchIDs = Array(nonStoredBuilding.apartments.length).fill(-1);
    let usedIDs = [];
    let apartmentResult = n_findApartmentMappingLevel(storedBuilding.apartments, nonStoredBuilding.apartments, SIMILARLY_TYPE_POSSIBLE_MATCH, matchIDs, usedIDs);

    // If an apartment has an ID match then we know the building is a match too
    if (apartmentResult.similarity >= SIMILARLY_TYPE_ID_MATCH) {
        return {
            similarity: SIMILARLY_TYPE_ID_MATCH,
            identical: buildingMatch.identical && apartmentResult.identical
        };
    }
    return {
        similarity: buildingMatch.similarity,
        identical: buildingMatch.identical && apartmentResult.identical
    };
}

/**
 * Attempt to match 2 lists of apartments based on there similarity. This only searches and does not modify the lists
 * @param {Apartment[]} storedApartments The existing list of apartments
 * @param {Apartment[]} nonStoredApartments The new list of apartments
 * @param {*} minMatch The minimum level of similarity needed for a match to be considered
 * @param {int[]} matchIDs An array of the same size as nonStoredApartments listing the IDs in storedApartments that match for each apartment. This is updated in this function
 * @param {int[]} usedIDs A list of storedApartments IDs that are already linked to apartments
 * @returns The maximum level of confidence seen between any 2 apartments
 */
function n_findApartmentMappingLevel(storedApartments, nonStoredApartments, minMatch, matchIDs, usedIDs) {
    // Check similarity of known matches 
    let allIdentical = true;
    let maxGlobalMatch = SIMILARLY_TYPE_MISMATCH;
    for (let nsa = 0; nsa < matchIDs.length; nsa++) {
        if (matchIDs[nsa] != -1) {
            let apartmentMatch = n_compareApartment(storedApartments[matchIDs[nsa]], nonStoredApartments[nsa]);
            if (!apartmentMatch.identical) {
                allIdentical = false;
            }
            if (apartmentMatch.similarity > maxGlobalMatch) {
                maxGlobalMatch = apartmentMatch.similarity;
            }
        }
    }

    // For each pair of apartments find out how similar they are
    var similarities = [];
    for (let nsa = 0; nsa < nonStoredApartments.length; nsa++) {
        if (matchIDs[nsa] != -1) {
            continue;
        }
        for (let sa = 0; sa < storedApartments.length; sa++) {
            if (usedIDs.includes(sa)) {
                continue;
            }
            let apartmentMatch = n_compareApartment(storedApartments[sa], nonStoredApartments[nsa]);
            similarities.push({
                match: apartmentMatch,
                sa: sa,
                nsa: nsa
            });
        }
    }

    // Sort for the best pair
    similarities = similarities.sort((a, b) => ((b.match.similarity * 2) + b.match.identical) - ((a.match.similarity * 2) + b.match.identical));

    // Assign the best pair
    for (const similarity of similarities) {

        // Once its below min stop sorting
        if (similarity.match.similarity < minMatch) {
            break;
        }
        if (matchIDs[similarity.nsa] == -1 && !usedIDs.includes(similarity.sa)) { // If both elements of the pair are unused
            matchIDs[similarity.nsa] = similarity.sa;
            usedIDs.push(similarity.sa);
            if (similarity.match.similarity > maxGlobalMatch) {
                maxGlobalMatch = similarity.match.similarity;
            }
            if (!similarity.match.identical) {
                allIdentical = false;
            }
        }
    }

    if (matchIDs.includes(-1) || usedIDs.length != storedApartments.length) {
        allIdentical = false;
    }

    return {
        similarity: maxGlobalMatch,
        identical: allIdentical
    };
}

/**
 * Determine if 2 buildings are similar (databaseID as well as all apartments are ignored)
 * @param {Building} storedBuilding The first building to compare
 * @param {Building} nonStoredBuilding The second building to compare
 * @returns The SIMILARLY_TYPE_ type
 */
function n_compareBuilding(storedBuilding, nonStoredBuilding) {
    let attResult = {
        allIdentical: true,
        mismatch: false,
        anyNotNullIdentical: false
    };

    // Compare changeable attributes
    n_compareAttribute(storedBuilding.status, nonStoredBuilding.status, attResult);

    // Compare attributes that have complex matching parameters (TODO check this better)
    n_compareAttribute(storedBuilding.name, nonStoredBuilding.name, attResult);
    n_compareAttribute(storedBuilding.address, nonStoredBuilding.address, attResult);
    // n_compareAttribute(storedBuilding.suumoName, nonStoredBuilding.suumoName, attResult); // TODO

    // Compare base attributes (TODO this is not perfect atm)
    attResult.mismatch = false;
    n_compareAttribute(storedBuilding.age, nonStoredBuilding.age, attResult);
    n_compareAttribute(storedBuilding.stories, nonStoredBuilding.stories, attResult);

    let matchIDs = Array(nonStoredBuilding.stations.length).fill(-1);
    let usedIDs = [];
    let stationResult = n_compareStations(storedBuilding.stations, nonStoredBuilding.stations, matchIDs, usedIDs);

    // TODO this used to be wrong and the test did not get it, check this
    if (attResult.mismatch || stationResult.similarity == SIMILARLY_TYPE_MISMATCH) {
        return {
            similarity: SIMILARLY_TYPE_MISMATCH,
            identical: false
        };
    }

    // TODO
    // if (storedBuilding.suumoName != null && storedBuilding.suumoAddress != null
    //     && nonStoredBuilding.suumoName != null && nonStoredBuilding.suumoAddress != null
    //     && (nonStoredBuilding.suumoName == storedBuilding.suumoName)
    //     && (nonStoredBuilding.suumoAddress == storedBuilding.suumoAddress)) {
    //     return {
    //         similarity: SIMILARLY_TYPE_POSSIBLE_MATCH,
    //         identical: attResult.allIdentical && stationResult.identical
    //     };
    // }

    // TODO this failed and tests did not catch it
    if (storedBuilding.name != null && storedBuilding.address != null
        && nonStoredBuilding.name != null && nonStoredBuilding.address != null
        && (nonStoredBuilding.name.includes(storedBuilding.name) || storedBuilding.name.includes(nonStoredBuilding.name))
        && (nonStoredBuilding.address.includes(storedBuilding.address) || storedBuilding.address.includes(nonStoredBuilding.address))) {
        return {
            similarity: SIMILARLY_TYPE_POSSIBLE_MATCH,
            identical: attResult.allIdentical && stationResult.identical
        };
    }

    return {
        similarity: SIMILARLY_TYPE_COMPATIBLE,
        identical: attResult.allIdentical && stationResult.identical
    };
}

/**
 * Compare 2 lists of stations
 * @param {Station[]} storedStations The stations from the database entry
 * @param {Station[]} nonStoredStations The stations to merge
 * @returns The SIMILARLY_TYPE_ type and if they are identical
 */
function n_compareStations(storedStations, nonStoredStations, matchIDs, usedIDs) {
    let isDelta = false;
    for (let nsa = 0; nsa < nonStoredStations.length; nsa++) {
        if (matchIDs[nsa] != -1) {
            continue;
        }

        for (let sa = 0; sa < storedStations.length; sa++) {
            if (usedIDs.includes(sa)) {
                continue;
            }
            if ((nonStoredStations[nsa].line == storedStations[sa].line) &&
                (nonStoredStations[nsa].station == storedStations[sa].station)) {
                if (Math.abs(nonStoredStations[nsa].distance - storedStations[sa].distance) >= 3) {
                    return {
                        similarity: SIMILARLY_TYPE_MISMATCH,
                        identical: false
                    };
                }
                usedIDs.push(sa);
                matchIDs[nsa] = sa;
                if (nonStoredStations[nsa].distance != storedStations[sa].distance) {
                    isDelta = true;
                }
                break;
            }
        }
    }

    if (isDelta) {
        return {
            similarity: SIMILARLY_TYPE_COMPATIBLE,
            identical: false
        };
    }
    return {
        similarity: SIMILARLY_TYPE_POSSIBLE_MATCH,
        identical: !matchIDs.includes(-1) && (storedStations.length == nonStoredStations.length)
    };
}

/**
 * Merge 2 apartments together. The order of apartments matters. If the new input is null and the old one is not, the old value will be kept 
 * @param {*} storedApartments The original Apartment instance to update
 * @param {*} nonStoredApartments The apartment with new data to merge from
 */
function n_mergeApartment(storedApartment, nonStoredApartment) {
    let matchType = n_compareApartment(storedApartment, nonStoredApartment);
    if (matchType.identical) {
        return;
    }
    if (matchType.similarity == SIMILARLY_TYPE_MISMATCH) {
        throw "Trying to merge incompatible apartments"
    }

    // Set no matter what
    if (nonStoredApartment.status != null) {
        storedApartment.status = nonStoredApartment.status;
    }

    // Only set if the core data is missing
    if (storedApartment.price == null) {
        storedApartment.price = nonStoredApartment.price;
    }
    if (storedApartment.managementFee == null) {
        storedApartment.managementFee = nonStoredApartment.managementFee;
    }
    if (storedApartment.floor == null) {
        storedApartment.floor = nonStoredApartment.floor;
    }
    if (storedApartment.deposit == null) {
        storedApartment.deposit = nonStoredApartment.deposit;
    }
    if (storedApartment.keyMoney == null) {
        storedApartment.keyMoney = nonStoredApartment.keyMoney;
    }
    if (storedApartment.layout == null) {
        storedApartment.layout = nonStoredApartment.layout;
    }
    if (storedApartment.size == null) {
        storedApartment.size = nonStoredApartment.size;
    }
    if (storedApartment.urls[SITE_SUUMO] == null) {
        storedApartment.urls[SITE_SUUMO] = nonStoredApartment.urls[SITE_SUUMO];
    }
    if (storedApartment.IDs[SITE_SUUMO] == null) {
        storedApartment.IDs[SITE_SUUMO] = nonStoredApartment.IDs[SITE_SUUMO];
    }
}

/**
 * Determine if 2 apartments are similar (databaseID is ignored)
 * @param {Apartment} storedApartments The first apartment to compare
 * @param {Apartment} nonStoredApartments The second apartment to compare
 * @returns The SIMILARLY_TYPE_ type
 */
function n_compareApartment(storedApartments, nonStoredApartments) {
    let attResult = {
        allIdentical: true,
        mismatch: false,
        anyNotNullIdentical: false
    };

    // Compare changeable attributes
    n_compareAttribute(storedApartments.status, nonStoredApartments.status, attResult);

    // Compare base attributes
    attResult.mismatch = false;
    n_compareAttribute(storedApartments.price, nonStoredApartments.price, attResult);
    n_compareAttribute(storedApartments.managementFee, nonStoredApartments.managementFee, attResult);
    n_compareAttribute(storedApartments.floor, nonStoredApartments.floor, attResult);
    n_compareAttribute(storedApartments.deposit, nonStoredApartments.deposit, attResult);
    n_compareAttribute(storedApartments.keyMoney, nonStoredApartments.keyMoney, attResult);
    n_compareAttribute(storedApartments.layout, nonStoredApartments.layout, attResult);
    n_compareAttribute(storedApartments.size, nonStoredApartments.size, attResult);
    n_compareAttribute(storedApartments.urls[SITE_SUUMO], nonStoredApartments.urls[SITE_SUUMO], attResult); // TODO needs to be redone

    // Compare IDs
    attResult.anyNotNullIdentical = false;
    // TODO needs to be redone
    n_compareAttribute(storedApartments.IDs[SITE_SUUMO], nonStoredApartments.IDs[SITE_SUUMO], attResult);

    // ID match
    if (attResult.anyNotNullIdentical) {
        if (attResult.mismatch) {
            throw "An ID matched apartment has mismatching data";
        }
        return {
            similarity: SIMILARLY_TYPE_ID_MATCH,
            identical: attResult.allIdentical
        };
    }

    // Mismatch
    if (attResult.mismatch) {
        return {
            similarity: SIMILARLY_TYPE_MISMATCH,
            identical: false
        };
    }

    // Check for minimum viable data for a match
    let isEnough = (storedApartments.price != null && storedApartments.layout != null && storedApartments.size != null
        && nonStoredApartments.price != null && nonStoredApartments.layout != null && nonStoredApartments.size != null);
    if (isEnough) {
        return {
            similarity: SIMILARLY_TYPE_POSSIBLE_MATCH,
            identical: attResult.allIdentical
        };
    }

    // Lowest level of compatibility
    return {
        similarity: SIMILARLY_TYPE_COMPATIBLE,
        identical: attResult.allIdentical
    };
}

/**
 * Compare 2 attributes in a rolling fashion. Only set values in certain cases, leave unchanged in others as bellow 
 * 
 * attResult.allIdentical = false     IF the 2 attributes are not identical (same value or both null)
 * attResult.mismatch = true            IF the 2 attributes are not null and don't have the same value 
 * attResult.anyNotNullIdentical = true    IF both attributes are not null and are the same value
 * 
 * @param {*} att1 The first attribute to check
 * @param {*} att2 The second attribute to check
 * @param {*} attResult The rolling result
 * @returns 
 */
function n_compareAttribute(att1, att2, attResult) {
    if (att1 != att2) {
        attResult.allIdentical = false;
        if (att1 != null && att2 != null) {
            attResult.mismatch = true;
        }
    } else {
        if (att1 != null) {
            attResult.anyNotNullIdentical = true;
        }
    }
}

/**
 * Convert an array of maps into a savable format
 * @param {*} IDMap The array to convert
 * @returns The savable version
 */
function n_idMapsToJson(IDMap) {
    let jsonArray = [];
    for (let i = 0; i < 10; i++) {
        jsonArray.push(Object.fromEntries(IDMap[i]));
    }
    return jsonArray;
}

/**
 * Create an array of Maps from savable data
 * @param {*} jsonArray The saveable data to convert 
 * @returns The usable array of maps
 */
function n_jsonToIDMaps(jsonArray) {
    let IDMap = [];
    for (let i = 0; i < 10; i++) { // MAX_SITE_NUM
        IDMap.push(new Map(Object.entries(jsonArray[i])));
    }
    return IDMap;
}

if (typeof require === 'function') {
    module.exports = {
        n_mergeIntoDatabase: n_mergeIntoDatabase,
        n_mergeBuilding: n_mergeBuilding,
        n_validateDatabase: n_validateDatabase,
        n_findBuilding: n_findBuilding,
        n_compareFullBuilding: n_compareFullBuilding,
        n_findApartmentMappingLevel: n_findApartmentMappingLevel,
        n_compareBuilding: n_compareBuilding,
        n_compareStations: n_compareStations,
        n_mergeApartment: n_mergeApartment,
        n_compareApartment: n_compareApartment,
        n_compareAttribute: n_compareAttribute,
        n_idMapsToJson: n_idMapsToJson,
        n_jsonToIDMaps: n_jsonToIDMaps,
        SIMILARLY_TYPE_ID_MATCH: SIMILARLY_TYPE_ID_MATCH,
        SIMILARLY_TYPE_POSSIBLE_MATCH: SIMILARLY_TYPE_POSSIBLE_MATCH,
        SIMILARLY_TYPE_COMPATIBLE: SIMILARLY_TYPE_COMPATIBLE,
        SIMILARLY_TYPE_MISMATCH: SIMILARLY_TYPE_MISMATCH,
    }
}

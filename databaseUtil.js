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

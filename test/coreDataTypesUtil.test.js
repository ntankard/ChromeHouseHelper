const { SITE_RNT, SITE_SUUMO } = require('./../utils/coreDataTypes');
const Types = require('./../utils/coreDataTypes');
const { n_validateDatabase, n_mergeIntoDatabase } = require('./../utils/coreDataTypesUtil');
const DatabaseUtil = require('./../utils/coreDataTypesUtil');

function generateTestBuildings(size) {
    let buildings = [];
    for (let i = 0; i < size; i++) {
        buildings.push(new Types.Building());
    }
    return buildings;
}

function generateTestApartments(size) {
    let apartments = [];
    for (let i = 0; i < size; i++) {
        apartments.push(new Types.Apartment());
    }
    return apartments;
}

function generateTestStations(size) {
    let statements = [];
    for (let i = 0; i < size; i++) {
        statements.push(new Types.Station());
        statements[i].line = "Line" + i.toString();
        statements[i].station = "Station" + i.toString();
        statements[i].distance = i * 10;
    }
    return statements;
}

function makeDatabase(buildings) {
    let database = new Types.FullData();
    database.coreData = buildings;
    for (let i = 0; i < database.coreData.length; i++) {
        database.coreData[i].databaseID = i;
        if (database.coreData[i].IDs[SITE_RNT] != null) {
            database.buildingIDMaps[Types.SITE_RNT].set(database.coreData[i].IDs[SITE_RNT], { buildingID: i });
        }
        for (let j = 0; j < database.coreData[i].apartments.length; j++) {
            database.coreData[i].apartments[j].databaseID = j;
            if (database.coreData[i].apartments[j].IDs[SITE_SUUMO] != null) {
                database.apartmentIDMaps[Types.SITE_SUUMO].set(database.coreData[i].apartments[j].IDs[SITE_SUUMO], { buildingID: i, apartmentID: j });
            }
            if (database.coreData[i].apartments[j].IDs[SITE_RNT] != null) {
                database.apartmentIDMaps[Types.SITE_RNT].set(database.coreData[i].apartments[j].IDs[SITE_RNT], { buildingID: i, apartmentID: j });
            }
        }
    }

    return database;
}

test("n_mergeIntoDatabase", () => {
    let database = makeDatabase(generateTestBuildings(3));
    let building = JSON.parse(JSON.stringify(database.coreData[1]));
    building.apartments.push(new Types.Apartment());
    expect(building.apartments[0].databaseID).toBe(-1);
    n_mergeIntoDatabase(building, database);
    expect(building.apartments[0].databaseID).toBe(0);
    expect(n_validateDatabase(database)).toBe(true);

    database = makeDatabase(generateTestBuildings(3));
    building = JSON.parse(JSON.stringify(database.coreData[1]));
    building.apartments.push(new Types.Apartment());
    building.apartments.push(new Types.Apartment());
    building.apartments.push(new Types.Apartment());
    expect(building.apartments[0].databaseID).toBe(-1);
    expect(building.apartments[1].databaseID).toBe(-1);
    expect(building.apartments[2].databaseID).toBe(-1);
    n_mergeIntoDatabase(building, database);
    expect(building.apartments[0].databaseID).toBe(0);
    expect(building.apartments[1].databaseID).toBe(1);
    expect(building.apartments[2].databaseID).toBe(2);
    expect(n_validateDatabase(database)).toBe(true);

    let buildings = generateTestBuildings(3);
    buildings[1].apartments.push(new Types.Apartment());
    buildings[1].apartments.push(new Types.Apartment());
    database = makeDatabase(buildings);
    building = JSON.parse(JSON.stringify(database.coreData[1]));
    building.apartments.push(new Types.Apartment());
    expect(building.apartments[0].databaseID).toBe(0);
    expect(building.apartments[1].databaseID).toBe(1);
    expect(building.apartments[2].databaseID).toBe(-1);
    n_mergeIntoDatabase(building, database);
    expect(building.apartments[0].databaseID).toBe(0);
    expect(building.apartments[1].databaseID).toBe(1);
    expect(building.apartments[2].databaseID).toBe(2);
    expect(n_validateDatabase(database)).toBe(true);

    buildings = generateTestBuildings(3);
    database = makeDatabase(buildings);
    building = new Types.Building();
    building.apartments.push(new Types.Apartment());
    expect(building.databaseID).toBe(-1);
    expect(building.apartments[0].databaseID).toBe(-1);
    n_mergeIntoDatabase(building, database);
    expect(building.databaseID).toBe(3);
    expect(building.apartments[0].databaseID).toBe(0);
    expect(n_validateDatabase(database)).toBe(true);

    database = makeDatabase(generateTestBuildings(3));
    building = JSON.parse(JSON.stringify(database.coreData[1]));
    building.stations.push(new Types.Station());
    expect(building.stations[0].databaseID).toBe(-1);
    n_mergeIntoDatabase(building, database);
    expect(building.stations[0].databaseID).toBe(0);
    expect(n_validateDatabase(database)).toBe(true);

    database = makeDatabase(generateTestBuildings(3));
    database.coreData[1].status = "TEST1";
    building = JSON.parse(JSON.stringify(database.coreData[1]));
    building.status = "TEST2";
    expect(database.coreData[1].status).toBe("TEST1");
    n_mergeIntoDatabase(building, database);
    expect(database.coreData[1].status).toBe("TEST2");
    expect(n_validateDatabase(database)).toBe(true);

    buildings = generateTestBuildings(3);
    buildings[1].apartments.push(new Types.Apartment());
    buildings[1].apartments[0].status = "AA";
    database = makeDatabase(buildings);
    building = JSON.parse(JSON.stringify(database.coreData[1]));
    building.apartments[0].status = "BB";
    expect(database.coreData[1].apartments[0].status).toBe("AA");
    n_mergeIntoDatabase(building, database);
    expect(database.coreData[1].apartments[0].status).toBe("BB");
    expect(n_validateDatabase(database)).toBe(true);

    buildings = generateTestBuildings(3);
    buildings[1].apartments.push(new Types.Apartment());
    database = makeDatabase(buildings);
    building = JSON.parse(JSON.stringify(database.coreData[1]));
    building.apartments[0].IDs[SITE_SUUMO] = String(123);
    expect(database.coreData[1].apartments[0].IDs[SITE_SUUMO]).toBe(undefined);
    n_mergeIntoDatabase(building, database);
    expect(database.coreData[1].apartments[0].IDs[SITE_SUUMO]).toBe(String(123));
    expect(n_validateDatabase(database)).toBe(true);

    database = makeDatabase([]);
    building = new Types.Building()
    building.apartments.push(new Types.Apartment());
    building.apartments[0].IDs[SITE_SUUMO] = String(123);
    n_mergeIntoDatabase(building, database);
    expect(database.coreData[0].apartments[0].IDs[SITE_SUUMO]).toBe(String(123));
    expect(n_validateDatabase(database)).toBe(true);

    database = makeDatabase([]);
    building = new Types.Building();
    building.apartments.push(new Types.Apartment());
    building.apartments[0].IDs[SITE_SUUMO] = String(123);
    building.statements = generateTestStations(1);
    n_mergeIntoDatabase(building, database);
    expect(n_validateDatabase(database)).toBe(true);
    expect(database.coreData[0].statements.length).toBe(1);
    expect(database.coreData[0].apartments.length).toBe(1);
    building = new Types.Building();
    building.databaseID = 0;
    building.apartments.push(new Types.Apartment());
    building.apartments[0].IDs[SITE_SUUMO] = String(124);
    building.statements = generateTestStations(1);
    n_mergeIntoDatabase(building, database);
    expect(n_validateDatabase(database)).toBe(true);
    expect(database.coreData[0].statements.length).toBe(1);
    expect(database.coreData[0].apartments.length).toBe(2);
});

test("n_mergeBuilding", () => {
    let store = new Types.Building();
    let nonStored = new Types.Building();
    store.stories = 500;
    nonStored.stories = 400;
    expect(() => DatabaseUtil.n_mergeBuilding(store, nonStored)).toThrow("Trying to merge incompatible buildings");

    store = new Types.Building();
    nonStored = new Types.Building();
    store.stories = 500;
    DatabaseUtil.n_mergeBuilding(store, nonStored)
    expect(store.stories).toBe(500);
    expect(nonStored.stories).toBe(undefined);

    store = new Types.Building();
    nonStored = new Types.Building();
    nonStored.stories = 500;
    DatabaseUtil.n_mergeBuilding(store, nonStored)
    expect(store.stories).toBe(500);
    expect(nonStored.stories).toBe(500);

    store = new Types.Building();
    nonStored = new Types.Building();
    nonStored.databaseID = 500;
    DatabaseUtil.n_mergeBuilding(store, nonStored)
    expect(store.databaseID).toBe(-1);
    expect(nonStored.databaseID).toBe(500);

    store = new Types.Building();
    nonStored = new Types.Building();
    store.databaseID = 500;
    DatabaseUtil.n_mergeBuilding(store, nonStored)
    expect(store.databaseID).toBe(500);
    expect(nonStored.databaseID).toBe(-1);

    store = new Types.Building();
    nonStored = new Types.Building();
    store.status = "TEST";
    DatabaseUtil.n_mergeBuilding(store, nonStored)
    expect(store.status).toBe("TEST");
    expect(nonStored.status).toBe(undefined);

    store = new Types.Building();
    nonStored = new Types.Building();
    nonStored.status = "TEST";
    DatabaseUtil.n_mergeBuilding(store, nonStored)
    expect(store.status).toBe("TEST");
    expect(nonStored.status).toBe("TEST");

    store = new Types.Building();
    nonStored = new Types.Building();
    store.status = "TEST";
    nonStored.status = "TEST2";
    DatabaseUtil.n_mergeBuilding(store, nonStored)
    expect(store.status).toBe("TEST2");
    expect(nonStored.status).toBe("TEST2");

    store = new Types.Building();
    nonStored = new Types.Building();
    store.apartments = generateTestApartments(4);
    nonStored.apartments = generateTestApartments(5);
    nonStored.apartments[0].databaseID = 4;
    expect(() => DatabaseUtil.n_mergeBuilding(store, nonStored)).toThrow("Impossible apartment ID match");

    // No matching apartments
    store = new Types.Building();
    nonStored = new Types.Building();
    store.apartments = generateTestApartments(4);
    nonStored.apartments = generateTestApartments(5);
    DatabaseUtil.n_mergeBuilding(store, nonStored);
    expect(store.apartments.length).toBe(4 + 5);

    // Match by database ID - 1
    store = new Types.Building();
    nonStored = new Types.Building();
    store.apartments = generateTestApartments(4);
    nonStored.apartments = generateTestApartments(5);
    nonStored.apartments[0].databaseID = 1;
    nonStored.apartments[0].price = 500;
    expect(store.apartments[1].price).toBe(undefined);
    DatabaseUtil.n_mergeBuilding(store, nonStored);
    expect(store.apartments.length).toBe(4 + 5 - 1);
    expect(store.apartments[1].price).toBe(500);

    // Match by database ID - 2
    store = new Types.Building();
    nonStored = new Types.Building();
    store.apartments = generateTestApartments(4);
    nonStored.apartments = generateTestApartments(5);
    nonStored.apartments[3].databaseID = 2;
    nonStored.apartments[3].price = 500;
    expect(store.apartments[2].price).toBe(undefined);
    DatabaseUtil.n_mergeBuilding(store, nonStored);
    expect(store.apartments.length).toBe(4 + 5 - 1);
    expect(store.apartments[2].price).toBe(500);

    store = new Types.Building();
    nonStored = new Types.Building();
    store.apartments = generateTestApartments(4);
    nonStored.apartments = generateTestApartments(5);
    store.apartments[2].IDs[SITE_SUUMO] = String(255);
    nonStored.apartments[3].IDs[SITE_SUUMO] = String(255);
    nonStored.apartments[3].price = 500;
    expect(store.apartments[2].price).toBe(undefined);
    DatabaseUtil.n_mergeBuilding(store, nonStored);
    expect(store.apartments.length).toBe(4 + 5 - 1);
    expect(store.apartments[2].price).toBe(500);

    store = new Types.Building();
    nonStored = new Types.Building();
    store.apartments = generateTestApartments(4);
    nonStored.apartments = generateTestApartments(5);
    store.apartments[2].IDs[SITE_SUUMO] = String(255);
    nonStored.apartments[3].IDs[SITE_SUUMO] = String(255);
    nonStored.apartments[3].price = 500;
    store.apartments[0].IDs[SITE_SUUMO] = String(66);
    nonStored.apartments[0].IDs[SITE_SUUMO] = String(66);
    nonStored.apartments[0].floor = 2;
    expect(store.apartments[2].price).toBe(undefined);
    DatabaseUtil.n_mergeBuilding(store, nonStored);
    expect(store.apartments.length).toBe(4 + 5 - 2);
    expect(store.apartments[2].price).toBe(500);
    expect(store.apartments[0].floor).toBe(2);

    store = new Types.Building();
    nonStored = new Types.Building();
    store.apartments = generateTestApartments(4);
    nonStored.apartments = generateTestApartments(5);
    store.apartments[2].IDs[SITE_SUUMO] = String(255);
    store.apartments[2].price = 600;
    nonStored.apartments[3].IDs[SITE_SUUMO] = String(255);
    nonStored.apartments[3].price = 500;
    expect(() => DatabaseUtil.n_mergeBuilding(store, nonStored)).toThrow("An ID matched apartment has mismatching data");

    store = new Types.Building();
    nonStored = new Types.Building();
    store.apartments = generateTestApartments(4);
    nonStored.apartments = generateTestApartments(5);
    nonStored.apartments[1].price = 10;
    nonStored.apartments[1].layout = "1LDK";
    nonStored.apartments[1].size = 25.1;
    nonStored.apartments[1].floor = 500;
    store.apartments[3].price = 10;
    store.apartments[3].layout = "1LDK";
    store.apartments[3].size = 25.1;
    expect(store.apartments[3].floor).toBe(undefined);
    DatabaseUtil.n_mergeBuilding(store, nonStored);
    expect(store.apartments.length).toBe(4 + 5 - 1);
    expect(store.apartments[3].floor).toBe(500);

    store = new Types.Building();
    nonStored = new Types.Building();
    store.stations = generateTestStations(4);
    nonStored.stations = generateTestStations(5);
    nonStored.stations[0].databaseID = 4;
    expect(() => DatabaseUtil.n_mergeBuilding(store, nonStored)).toThrow("Impossible station ID match");

    store = new Types.Building();
    nonStored = new Types.Building();
    store.stations = generateTestStations(2);
    nonStored.stations = generateTestStations(3);
    DatabaseUtil.n_mergeBuilding(store, nonStored);
    expect(store.stations.length).toBe(3);

    store = new Types.Building();
    nonStored = new Types.Building();
    store.stations = generateTestStations(2);
    nonStored.stations = generateTestStations(2);
    nonStored.stations.splice(1, 0, new Types.Station());
    nonStored.stations[1].line = "Test1";
    nonStored.stations[1].station = "Test2";
    nonStored.stations[1].distance = 5;
    DatabaseUtil.n_mergeBuilding(store, nonStored);
    expect(store.stations.length).toBe(3);

    store = new Types.Building();
    nonStored = new Types.Building();
    store.databaseID = 0;
    nonStored.databaseID = 0;
    store.apartments = generateTestApartments(4);
    nonStored.apartments = generateTestApartments(5);
    nonStored.apartments[1].databaseID = 3;
    nonStored.apartments[1].price = 10;
    nonStored.apartments[1].layout = "1LDK";
    nonStored.apartments[1].size = 25.1;
    nonStored.apartments[1].floor = 500;
    store.apartments[3].databaseID = 3;
    store.apartments[3].price = 10;
    store.apartments[3].layout = "1LDK";
    store.apartments[3].size = 25.1;
    expect(store.apartments[3].floor).toBe(undefined);
    DatabaseUtil.n_mergeBuilding(store, nonStored);
    expect(store.apartments.length).toBe(4 + 5 - 1);
    expect(store.apartments[3].floor).toBe(500);
})

test("n_validateDatabase", () => {
    let buildings = generateTestBuildings(3);
    buildings[0].apartments = generateTestApartments(1);
    buildings[2].apartments = generateTestApartments(4);
    let database = makeDatabase(buildings);
    expect(DatabaseUtil.n_validateDatabase(database)).toBe(true);

    buildings = generateTestBuildings(3);
    buildings[0].apartments = generateTestApartments(1);
    buildings[0].apartments[0].IDs[SITE_SUUMO] = String(400);
    buildings[2].apartments = generateTestApartments(4);
    buildings[2].apartments[1].IDs[SITE_SUUMO] = String(500);
    buildings[2].apartments[3].IDs[SITE_SUUMO] = String(600);
    database = makeDatabase(buildings);
    expect(DatabaseUtil.n_validateDatabase(database)).toBe(true);

    buildings = generateTestBuildings(3);
    buildings[0].apartments = generateTestApartments(1);
    buildings[0].apartments[0].IDs[SITE_SUUMO] = String(400);
    buildings[2].apartments = generateTestApartments(4);
    buildings[2].apartments[1].IDs[SITE_SUUMO] = String(500);
    buildings[2].apartments[3].IDs[SITE_SUUMO] = String(500);
    database = makeDatabase(buildings);
    expect(DatabaseUtil.n_validateDatabase(database)).toBe(false);

    buildings = generateTestBuildings(3);
    buildings[0].apartments = generateTestApartments(1);
    buildings[0].apartments[0].IDs[SITE_SUUMO] = String(400);
    buildings[2].apartments = generateTestApartments(4);
    buildings[2].apartments[1].IDs[SITE_SUUMO] = String(500);
    database = makeDatabase(buildings);
    buildings[2].apartments[3].IDs[SITE_SUUMO] = String(600);
    expect(DatabaseUtil.n_validateDatabase(database)).toBe(false);

    buildings = generateTestBuildings(3);
    buildings[0].apartments = generateTestApartments(1);
    buildings[0].apartments[0].IDs[SITE_SUUMO] = String(400);
    buildings[2].apartments = generateTestApartments(4);
    buildings[2].apartments[1].IDs[SITE_SUUMO] = String(500);
    buildings[2].apartments[3].IDs[SITE_SUUMO] = String(600);
    database = makeDatabase(buildings);
    database.apartmentIDMaps[Types.SITE_SUUMO].set(String(500), { buildingID: 0, apartmentID: 0 });
    expect(DatabaseUtil.n_validateDatabase(database)).toBe(false);

    buildings = generateTestBuildings(3);
    buildings[0].apartments = generateTestApartments(1);
    buildings[0].apartments[0].IDs[SITE_SUUMO] = String(400);
    buildings[2].apartments = generateTestApartments(4);
    buildings[2].apartments[1].IDs[SITE_SUUMO] = String(500);
    buildings[2].apartments[3].IDs[SITE_SUUMO] = String(600);
    database = makeDatabase(buildings);
    database.apartmentIDMaps[Types.SITE_SUUMO].delete(String(500));
    expect(DatabaseUtil.n_validateDatabase(database)).toBe(false);

    buildings = generateTestBuildings(3);
    buildings[0].apartments = generateTestApartments(1);
    buildings[0].apartments[0].IDs[SITE_SUUMO] = String(400);
    buildings[2].apartments = generateTestApartments(4);
    buildings[2].apartments[1].IDs[SITE_SUUMO] = String(500);
    buildings[2].apartments[3].IDs[SITE_SUUMO] = String(600);
    database = makeDatabase(buildings);
    buildings[1].apartments = generateTestApartments(2);
    expect(DatabaseUtil.n_validateDatabase(database)).toBe(false);

    buildings = generateTestBuildings(3);
    buildings[0].apartments = generateTestApartments(1);
    buildings[0].apartments[0].IDs[SITE_SUUMO] = String(400);
    buildings[2].apartments = generateTestApartments(4);
    buildings[2].apartments[1].IDs[SITE_SUUMO] = String(500);
    buildings[2].apartments[3].IDs[SITE_SUUMO] = String(600);
    database = makeDatabase(buildings);
    buildings[0].apartments[0].databaseID = 100;
    expect(DatabaseUtil.n_validateDatabase(database)).toBe(false);

    buildings = generateTestBuildings(3);
    buildings[0].apartments = generateTestApartments(1);
    buildings[0].apartments[0].IDs[SITE_SUUMO] = String(400);
    buildings[2].apartments = generateTestApartments(4);
    buildings[2].apartments[1].IDs[SITE_SUUMO] = String(500);
    buildings[2].apartments[3].IDs[SITE_SUUMO] = String(600);
    database = makeDatabase(buildings);
    buildings[0].databaseID = 100;
    expect(DatabaseUtil.n_validateDatabase(database)).toBe(false);
})

test("n_findBuilding", () => {
    let buildings = generateTestBuildings(3);
    buildings[0].apartments = generateTestApartments(1);
    buildings[2].apartments = generateTestApartments(4);
    let database = makeDatabase(buildings);
    let testBuilding = new Types.Building()
    testBuilding.databaseID = 0;
    let result = DatabaseUtil.n_findBuilding(testBuilding, database);
    expect(result.databaseID).toBe(0);
    expect(result).toBe(buildings[0]);

    buildings = generateTestBuildings(3);
    buildings[0].apartments = generateTestApartments(1);
    buildings[2].apartments = generateTestApartments(4);
    database = makeDatabase(buildings);
    testBuilding = new Types.Building()
    result = DatabaseUtil.n_findBuilding(testBuilding, database);
    expect(result).toBe(null);

    buildings = generateTestBuildings(3);
    buildings[0].apartments = generateTestApartments(1);
    buildings[2].apartments = generateTestApartments(4);
    database = makeDatabase(buildings);
    testBuilding = new Types.Building()
    testBuilding.databaseID = 2;
    result = DatabaseUtil.n_findBuilding(testBuilding, database);
    expect(result.databaseID).toBe(2);
    expect(result).toBe(buildings[2]);

    buildings = generateTestBuildings(3);
    buildings[0].apartments = generateTestApartments(1);
    buildings[2].apartments = generateTestApartments(4);
    buildings[2].apartments[0].IDs[SITE_SUUMO] = String(300);
    database = makeDatabase(buildings);
    testBuilding = new Types.Building();
    testBuilding.apartments = generateTestApartments(2);
    testBuilding.apartments[0].IDs[SITE_SUUMO] = String(300);
    result = DatabaseUtil.n_findBuilding(testBuilding, database);
    expect(result.databaseID).toBe(2);
    expect(result).toBe(buildings[2]);

    // TODO
    // buildings = generateTestBuildings(3);
    // buildings[0].apartments = generateTestApartments(1);
    // buildings[2].apartments = generateTestApartments(4);
    // buildings[1].name = "Test";
    // buildings[1].address = "Test2";
    // database = makeDatabase(buildings);
    // testBuilding = new Types.Building();
    // testBuilding.name = "Test";
    // testBuilding.address = "Test2";
    // result = DatabaseUtil.n_findBuilding(testBuilding, database);
    // expect(result.databaseID).toBe(1);
    // expect(result).toBe(buildings[1]);

    // TODO
    // buildings = generateTestBuildings(3);
    // buildings[0].apartments = generateTestApartments(1);
    // buildings[2].apartments = generateTestApartments(4);
    // buildings[1].name = "Test";
    // buildings[1].address = "Test2";
    // database = makeDatabase(buildings);
    // testBuilding = new Types.Building();
    // testBuilding.name = "Test";
    // testBuilding.address = "Test2";
    // testBuilding.stories = 5;
    // result = DatabaseUtil.n_findBuilding(testBuilding, database);
    // expect(result.databaseID).toBe(1);
    // expect(result).toBe(buildings[1]);

    buildings = generateTestBuildings(3);
    buildings[0].apartments = generateTestApartments(1);
    buildings[2].apartments = generateTestApartments(4);
    buildings[1].name = "Test";
    buildings[1].address = "Test2";
    buildings[1].stories = 6;
    database = makeDatabase(buildings);
    testBuilding = new Types.Building();
    testBuilding.name = "Test";
    testBuilding.address = "Test2";
    testBuilding.stories = 5;
    result = DatabaseUtil.n_findBuilding(testBuilding, database);
    expect(result).toBe(null);

    // TODO here we should keep searching to check for a conflicting building ID. This happens if the data on the product page does not  match for 2 entries
    // https://suumo.jp/jj/chintai/ichiran/FR301FC001/?ar=030&bs=040&ta=11&sc=11101&cb=0.0&ct=9999999&et=9999999&cn=9999999&mb=0&mt=9999999&shkr1=03&shkr2=03&shkr3=03&shkr4=03&fw2=&srch_navi=1
    // https://suumo.jp/chintai/jnc_000073855175/?bc=100294679086
    // TODO add case where 1 building has multiple suumo ID in the map
})

test("n_compareFullBuilding", () => {
    let nonStoredBuilding = new Types.Building();
    let storedBuilding = new Types.Building();
    expect(DatabaseUtil.n_compareFullBuilding(storedBuilding, nonStoredBuilding)).toStrictEqual({ similarity: DatabaseUtil.SIMILARLY_TYPE_COMPATIBLE, identical: true });

    nonStoredBuilding = new Types.Building();
    storedBuilding = new Types.Building();
    nonStoredBuilding.apartments = generateTestApartments(4);
    storedBuilding.apartments = generateTestApartments(4);
    nonStoredBuilding.apartments[1].price = 10;
    nonStoredBuilding.apartments[1].layout = "1LDK";
    nonStoredBuilding.apartments[1].size = 25.1;
    storedBuilding.apartments[3].price = 10;
    storedBuilding.apartments[3].layout = "1LDK";
    storedBuilding.apartments[3].size = 25.1;
    expect(DatabaseUtil.n_compareFullBuilding(storedBuilding, nonStoredBuilding)).toStrictEqual({ similarity: DatabaseUtil.SIMILARLY_TYPE_COMPATIBLE, identical: false });

    nonStoredBuilding = new Types.Building();
    storedBuilding = new Types.Building();
    nonStoredBuilding.apartments = generateTestApartments(4);
    storedBuilding.apartments = generateTestApartments(4);
    nonStoredBuilding.apartments[1].IDs[SITE_SUUMO] = String(10);
    storedBuilding.apartments[3].IDs[SITE_SUUMO] = String(10);
    expect(DatabaseUtil.n_compareFullBuilding(storedBuilding, nonStoredBuilding)).toStrictEqual({ similarity: DatabaseUtil.SIMILARLY_TYPE_ID_MATCH, identical: false });

    nonStoredBuilding = new Types.Building();
    storedBuilding = new Types.Building();
    nonStoredBuilding.apartments = generateTestApartments(2);
    storedBuilding.apartments = generateTestApartments(4);
    nonStoredBuilding.stories = 4;
    nonStoredBuilding.apartments[1].IDs[SITE_SUUMO] = String(10);
    storedBuilding.stories = 5;
    storedBuilding.apartments[3].IDs[SITE_SUUMO] = String(10);
    expect(DatabaseUtil.n_compareFullBuilding(storedBuilding, nonStoredBuilding)).toStrictEqual({ similarity: DatabaseUtil.SIMILARLY_TYPE_MISMATCH, identical: false });

    nonStoredBuilding = new Types.Building();
    storedBuilding = new Types.Building();
    nonStoredBuilding.apartments = generateTestApartments(2);
    storedBuilding.apartments = generateTestApartments(4);
    nonStoredBuilding.name = "123 f";
    nonStoredBuilding.address = "123 f";
    storedBuilding.name = "123 f";
    storedBuilding.address = "123 f";
    expect(DatabaseUtil.n_compareFullBuilding(storedBuilding, nonStoredBuilding)).toStrictEqual({ similarity: DatabaseUtil.SIMILARLY_TYPE_POSSIBLE_MATCH, identical: false });

    nonStoredBuilding = new Types.Building();
    storedBuilding = new Types.Building();
    nonStoredBuilding.apartments = generateTestApartments(2);
    storedBuilding.apartments = generateTestApartments(2);
    nonStoredBuilding.apartments[0].IDs[SITE_SUUMO] = String(5);
    nonStoredBuilding.apartments[1].IDs[SITE_SUUMO] = String(51);
    storedBuilding.apartments[0].IDs[SITE_SUUMO] = String(5);
    storedBuilding.apartments[1].IDs[SITE_SUUMO] = String(51);
    expect(DatabaseUtil.n_compareFullBuilding(storedBuilding, nonStoredBuilding)).toStrictEqual({ similarity: DatabaseUtil.SIMILARLY_TYPE_ID_MATCH, identical: true });

    nonStoredBuilding = new Types.Building();
    storedBuilding = new Types.Building();
    nonStoredBuilding.apartments = generateTestApartments(3);
    storedBuilding.apartments = generateTestApartments(2);
    nonStoredBuilding.apartments[0].IDs[SITE_SUUMO] = String(5);
    nonStoredBuilding.apartments[1].IDs[SITE_SUUMO] = String(51);
    storedBuilding.apartments[0].IDs[SITE_SUUMO] = String(5);
    storedBuilding.apartments[1].IDs[SITE_SUUMO] = String(51);
    expect(DatabaseUtil.n_compareFullBuilding(storedBuilding, nonStoredBuilding)).toStrictEqual({ similarity: DatabaseUtil.SIMILARLY_TYPE_ID_MATCH, identical: false });

    nonStoredBuilding = new Types.Building();
    storedBuilding = new Types.Building();
    nonStoredBuilding.apartments = generateTestApartments(2);
    storedBuilding.apartments = generateTestApartments(3);
    nonStoredBuilding.apartments[0].IDs[SITE_SUUMO] = String(5);
    nonStoredBuilding.apartments[1].IDs[SITE_SUUMO] = String(51);
    storedBuilding.apartments[0].IDs[SITE_SUUMO] = String(5);
    storedBuilding.apartments[1].IDs[SITE_SUUMO] = String(51);
    expect(DatabaseUtil.n_compareFullBuilding(storedBuilding, nonStoredBuilding)).toStrictEqual({ similarity: DatabaseUtil.SIMILARLY_TYPE_ID_MATCH, identical: false });

    nonStoredBuilding = new Types.Building();
    storedBuilding = new Types.Building();
    nonStoredBuilding.apartments = generateTestApartments(2);
    storedBuilding.apartments = generateTestApartments(2);
    nonStoredBuilding.apartments[0].price = 5;
    nonStoredBuilding.apartments[0].layout = "aa";
    nonStoredBuilding.apartments[0].size = 51;
    nonStoredBuilding.apartments[1].price = 52;
    nonStoredBuilding.apartments[1].layout = "ada";
    nonStoredBuilding.apartments[1].size = 512;
    storedBuilding.apartments[0].price = 5;
    storedBuilding.apartments[0].layout = "aa";
    storedBuilding.apartments[0].size = 51;
    storedBuilding.apartments[1].price = 52;
    storedBuilding.apartments[1].layout = "ada";
    storedBuilding.apartments[1].size = 512;
    expect(DatabaseUtil.n_compareFullBuilding(storedBuilding, nonStoredBuilding)).toStrictEqual({ similarity: DatabaseUtil.SIMILARLY_TYPE_COMPATIBLE, identical: true });

    nonStoredBuilding = new Types.Building();
    storedBuilding = new Types.Building();
    nonStoredBuilding.apartments = generateTestApartments(2);
    storedBuilding.apartments = generateTestApartments(2);
    nonStoredBuilding.stories = 4;
    nonStoredBuilding.apartments[0].price = 5;
    nonStoredBuilding.apartments[0].layout = "aa";
    nonStoredBuilding.apartments[0].size = 51;
    nonStoredBuilding.apartments[1].price = 52;
    nonStoredBuilding.apartments[1].layout = "ada";
    nonStoredBuilding.apartments[1].size = 512;
    storedBuilding.apartments[0].price = 5;
    storedBuilding.apartments[0].layout = "aa";
    storedBuilding.apartments[0].size = 51;
    storedBuilding.apartments[1].price = 52;
    storedBuilding.apartments[1].layout = "ada";
    storedBuilding.apartments[1].size = 512;
    expect(DatabaseUtil.n_compareFullBuilding(storedBuilding, nonStoredBuilding)).toStrictEqual({ similarity: DatabaseUtil.SIMILARLY_TYPE_COMPATIBLE, identical: false });

    nonStoredBuilding = new Types.Building();
    storedBuilding = new Types.Building();
    nonStoredBuilding.apartments = generateTestApartments(2);
    storedBuilding.apartments = generateTestApartments(3);
    nonStoredBuilding.apartments[0].IDs[SITE_SUUMO] = String(5);
    expect(DatabaseUtil.n_compareFullBuilding(storedBuilding, nonStoredBuilding)).toStrictEqual({ similarity: DatabaseUtil.SIMILARLY_TYPE_COMPATIBLE, identical: false });

    nonStoredBuilding = new Types.Building();
    storedBuilding = new Types.Building();
    nonStoredBuilding.apartments = generateTestApartments(2);
    storedBuilding.apartments = generateTestApartments(3);
    storedBuilding.apartments[0].IDs[SITE_SUUMO] = String(5);
    expect(DatabaseUtil.n_compareFullBuilding(storedBuilding, nonStoredBuilding)).toStrictEqual({ similarity: DatabaseUtil.SIMILARLY_TYPE_COMPATIBLE, identical: false });
})

test("n_findApartmentMappingLevel", () => {
    // Default array with match above min (all should match)
    let nonStoredApartments = generateTestApartments(4);
    let storedApartments = generateTestApartments(2);
    let matchIDs = Array(nonStoredApartments.length).fill(-1);
    let usedIDs = [];
    expect(DatabaseUtil.n_findApartmentMappingLevel(storedApartments, nonStoredApartments, DatabaseUtil.SIMILARLY_TYPE_COMPATIBLE, matchIDs, usedIDs)).toStrictEqual({ similarity: DatabaseUtil.SIMILARLY_TYPE_COMPATIBLE, identical: false });
    expect(usedIDs.length).toBe(2);
    for (id of matchIDs) {
        if (id != -1) {
            expect(usedIDs).toContain(id);
        }
    }

    // Default array with match below min (none should match)
    matchIDs = Array(nonStoredApartments.length).fill(-1);
    usedIDs = [];
    expect(DatabaseUtil.n_findApartmentMappingLevel(storedApartments, nonStoredApartments, DatabaseUtil.SIMILARLY_TYPE_POSSIBLE_MATCH, matchIDs, usedIDs)).toStrictEqual({ similarity: DatabaseUtil.SIMILARLY_TYPE_MISMATCH, identical: false });
    expect(usedIDs.length).toBe(0);
    for (id of matchIDs) {
        if (id != -1) {
            expect(usedIDs).toContain(id);
        }
    }

    // Single ID match
    nonStoredApartments = generateTestApartments(6);
    storedApartments = generateTestApartments(8);
    matchIDs = Array(nonStoredApartments.length).fill(-1);
    usedIDs = [];
    nonStoredApartments[3].IDs[SITE_SUUMO] = String(10);
    storedApartments[1].IDs[SITE_SUUMO] = String(10);
    expect(DatabaseUtil.n_findApartmentMappingLevel(storedApartments, nonStoredApartments, DatabaseUtil.SIMILARLY_TYPE_COMPATIBLE, matchIDs, usedIDs)).toStrictEqual({ similarity: DatabaseUtil.SIMILARLY_TYPE_ID_MATCH, identical: false });
    expect(usedIDs.length).toBe(6);
    for (id of matchIDs) {
        if (id != -1) {
            expect(usedIDs).toContain(id);
        }
    }
    expect(matchIDs[3]).toBe(1);
    expect(usedIDs).toContain(1);

    // Single ID match (other order)
    nonStoredApartments = generateTestApartments(6);
    storedApartments = generateTestApartments(8);
    matchIDs = Array(nonStoredApartments.length).fill(-1);
    usedIDs = [];
    nonStoredApartments[1].IDs[SITE_SUUMO] = String(10);
    storedApartments[5].IDs[SITE_SUUMO] = String(10);
    expect(DatabaseUtil.n_findApartmentMappingLevel(storedApartments, nonStoredApartments, DatabaseUtil.SIMILARLY_TYPE_COMPATIBLE, matchIDs, usedIDs)).toStrictEqual({ similarity: DatabaseUtil.SIMILARLY_TYPE_ID_MATCH, identical: false });
    expect(usedIDs.length).toBe(6);
    for (id of matchIDs) {
        if (id != -1) {
            expect(usedIDs).toContain(id);
        }
    }
    expect(matchIDs[1]).toBe(5);
    expect(usedIDs).toContain(5);

    // Duel ID match
    nonStoredApartments = generateTestApartments(6);
    storedApartments = generateTestApartments(8);
    matchIDs = Array(nonStoredApartments.length).fill(-1);
    usedIDs = [];
    nonStoredApartments[1].IDs[SITE_SUUMO] = String(10);
    storedApartments[5].IDs[SITE_SUUMO] = String(10);
    nonStoredApartments[3].IDs[SITE_SUUMO] = String(20);
    storedApartments[1].IDs[SITE_SUUMO] = String(20);
    expect(DatabaseUtil.n_findApartmentMappingLevel(storedApartments, nonStoredApartments, DatabaseUtil.SIMILARLY_TYPE_COMPATIBLE, matchIDs, usedIDs)).toStrictEqual({ similarity: DatabaseUtil.SIMILARLY_TYPE_ID_MATCH, identical: false });
    expect(usedIDs.length).toBe(6);
    for (id of matchIDs) {
        if (id != -1) {
            expect(usedIDs).toContain(id);
        }
    }
    expect(matchIDs[1]).toBe(5);
    expect(usedIDs).toContain(5);
    expect(matchIDs[3]).toBe(1);
    expect(usedIDs).toContain(1);

    // Possible match
    nonStoredApartments = generateTestApartments(6);
    storedApartments = generateTestApartments(8);
    matchIDs = Array(nonStoredApartments.length).fill(-1);
    usedIDs = [];
    nonStoredApartments[1].price = 10;
    nonStoredApartments[1].layout = "1LDK";
    nonStoredApartments[1].size = 25.1;
    storedApartments[3].price = 10;
    storedApartments[3].layout = "1LDK";
    storedApartments[3].size = 25.1;
    expect(DatabaseUtil.n_findApartmentMappingLevel(storedApartments, nonStoredApartments, DatabaseUtil.SIMILARLY_TYPE_COMPATIBLE, matchIDs, usedIDs)).toStrictEqual({ similarity: DatabaseUtil.SIMILARLY_TYPE_POSSIBLE_MATCH, identical: false });
    expect(usedIDs.length).toBe(6);
    for (id of matchIDs) {
        if (id != -1) {
            expect(usedIDs).toContain(id);
        }
    }
    expect(matchIDs[1]).toBe(3);
    expect(usedIDs).toContain(3);

    // Possible match with better ID match
    nonStoredApartments = generateTestApartments(8);
    storedApartments = generateTestApartments(8);
    matchIDs = Array(nonStoredApartments.length).fill(-1);
    usedIDs = [];
    nonStoredApartments[1].price = 10;
    nonStoredApartments[1].layout = "1LDK";
    nonStoredApartments[1].size = 25.1;
    nonStoredApartments[1].IDs[SITE_SUUMO] = String(20);
    storedApartments[3].price = 10;
    storedApartments[3].layout = "1LDK";
    storedApartments[3].size = 25.1;
    storedApartments[5].IDs[SITE_SUUMO] = String(20);
    expect(DatabaseUtil.n_findApartmentMappingLevel(storedApartments, nonStoredApartments, DatabaseUtil.SIMILARLY_TYPE_COMPATIBLE, matchIDs, usedIDs)).toStrictEqual({ similarity: DatabaseUtil.SIMILARLY_TYPE_ID_MATCH, identical: false });
    expect(usedIDs.length).toBe(8);
    for (id of matchIDs) {
        if (id != -1) {
            expect(usedIDs).toContain(id);
        }
    }
    expect(matchIDs[1]).toBe(5);
    expect(usedIDs).toContain(5);

    // Possible match with better ID match other order
    nonStoredApartments = generateTestApartments(6);
    storedApartments = generateTestApartments(8);
    matchIDs = Array(nonStoredApartments.length).fill(-1);
    usedIDs = [];
    nonStoredApartments[1].price = 10;
    nonStoredApartments[1].layout = "1LDK";
    nonStoredApartments[1].size = 25.1;
    nonStoredApartments[1].IDs[SITE_SUUMO] = String(20);
    storedApartments[5].price = 10;
    storedApartments[5].layout = "1LDK";
    storedApartments[5].size = 25.1;
    storedApartments[3].IDs[SITE_SUUMO] = String(20);
    expect(DatabaseUtil.n_findApartmentMappingLevel(storedApartments, nonStoredApartments, DatabaseUtil.SIMILARLY_TYPE_COMPATIBLE, matchIDs, usedIDs)).toStrictEqual({ similarity: DatabaseUtil.SIMILARLY_TYPE_ID_MATCH, identical: false });
    expect(usedIDs.length).toBe(6);
    for (id of matchIDs) {
        if (id != -1) {
            expect(usedIDs).toContain(id);
        }
    }
    expect(matchIDs[1]).toBe(3);
    expect(usedIDs).toContain(3);

    // There is one high level match but a even better match for the next in the list
    nonStoredApartments = generateTestApartments(6);
    storedApartments = generateTestApartments(8);
    matchIDs = Array(nonStoredApartments.length).fill(-1);
    usedIDs = [];
    nonStoredApartments[1].price = 10;
    nonStoredApartments[1].layout = "1LDK";
    nonStoredApartments[1].size = 25.1;
    nonStoredApartments[1].IDs[SITE_SUUMO] = String(20);
    nonStoredApartments[3].price = 10;
    nonStoredApartments[3].layout = "1LDK";
    nonStoredApartments[3].size = 25.1;
    storedApartments[5].price = 10;
    storedApartments[5].layout = "1LDK";
    storedApartments[5].size = 25.1;
    storedApartments[5].IDs[SITE_SUUMO] = String(20);
    expect(DatabaseUtil.n_findApartmentMappingLevel(storedApartments, nonStoredApartments, DatabaseUtil.SIMILARLY_TYPE_COMPATIBLE, matchIDs, usedIDs)).toStrictEqual({ similarity: DatabaseUtil.SIMILARLY_TYPE_ID_MATCH, identical: false });
    expect(usedIDs.length).toBe(6);
    for (id of matchIDs) {
        if (id != -1) {
            expect(usedIDs).toContain(id);
        }
    }
    expect(matchIDs[1]).toBe(5);
    expect(usedIDs).toContain(5);

    // There is one high level match but a even better match for the next in the list other order
    nonStoredApartments = generateTestApartments(6);
    storedApartments = generateTestApartments(8);
    matchIDs = Array(nonStoredApartments.length).fill(-1);
    usedIDs = [];
    nonStoredApartments[3].price = 10;
    nonStoredApartments[3].layout = "1LDK";
    nonStoredApartments[3].size = 25.1;
    nonStoredApartments[3].IDs[SITE_SUUMO] = String(20);
    nonStoredApartments[1].price = 10;
    nonStoredApartments[1].layout = "1LDK";
    nonStoredApartments[1].size = 25.1;
    storedApartments[5].price = 10;
    storedApartments[5].layout = "1LDK";
    storedApartments[5].size = 25.1;
    storedApartments[5].IDs[SITE_SUUMO] = String(20);
    expect(DatabaseUtil.n_findApartmentMappingLevel(storedApartments, nonStoredApartments, DatabaseUtil.SIMILARLY_TYPE_COMPATIBLE, matchIDs, usedIDs)).toStrictEqual({ similarity: DatabaseUtil.SIMILARLY_TYPE_ID_MATCH, identical: false });
    expect(usedIDs.length).toBe(6);
    for (id of matchIDs) {
        if (id != -1) {
            expect(usedIDs).toContain(id);
        }
    }
    expect(matchIDs[3]).toBe(5);
    expect(usedIDs).toContain(5);

    nonStoredApartments = generateTestApartments(4);
    storedApartments = generateTestApartments(4);
    matchIDs = Array(nonStoredApartments.length).fill(-1);
    usedIDs = [];
    expect(DatabaseUtil.n_findApartmentMappingLevel(storedApartments, nonStoredApartments, DatabaseUtil.SIMILARLY_TYPE_COMPATIBLE, matchIDs, usedIDs)).toStrictEqual({ similarity: DatabaseUtil.SIMILARLY_TYPE_COMPATIBLE, identical: true });
    expect(usedIDs.length).toBe(4);
    for (id of matchIDs) {
        if (id != -1) {
            expect(usedIDs).toContain(id);
        }
    }

    nonStoredApartments = generateTestApartments(4);
    storedApartments = generateTestApartments(5);
    matchIDs = Array(nonStoredApartments.length).fill(-1);
    usedIDs = [];
    expect(DatabaseUtil.n_findApartmentMappingLevel(storedApartments, nonStoredApartments, DatabaseUtil.SIMILARLY_TYPE_COMPATIBLE, matchIDs, usedIDs)).toStrictEqual({ similarity: DatabaseUtil.SIMILARLY_TYPE_COMPATIBLE, identical: false });
    expect(usedIDs.length).toBe(4);
    for (id of matchIDs) {
        if (id != -1) {
            expect(usedIDs).toContain(id);
        }
    }

    nonStoredApartments = generateTestApartments(5);
    storedApartments = generateTestApartments(4);
    matchIDs = Array(nonStoredApartments.length).fill(-1);
    usedIDs = [];
    expect(DatabaseUtil.n_findApartmentMappingLevel(storedApartments, nonStoredApartments, DatabaseUtil.SIMILARLY_TYPE_COMPATIBLE, matchIDs, usedIDs)).toStrictEqual({ similarity: DatabaseUtil.SIMILARLY_TYPE_COMPATIBLE, identical: false });
    expect(usedIDs.length).toBe(4);
    for (id of matchIDs) {
        if (id != -1) {
            expect(usedIDs).toContain(id);
        }
    }

    nonStoredApartments = generateTestApartments(6);
    storedApartments = generateTestApartments(6);
    matchIDs = Array(nonStoredApartments.length).fill(-1);
    usedIDs = [];
    nonStoredApartments[1].price = 10;
    nonStoredApartments[1].layout = "1LDK";
    nonStoredApartments[1].size = 25.1;
    nonStoredApartments[1].status = "UPDATED";
    storedApartments[3].price = 10;
    storedApartments[3].layout = "1LDK";
    storedApartments[3].size = 25.1;
    matchIDs[1] = 3;
    usedIDs.push(3);
    expect(DatabaseUtil.n_findApartmentMappingLevel(storedApartments, nonStoredApartments, DatabaseUtil.SIMILARLY_TYPE_COMPATIBLE, matchIDs, usedIDs)).toStrictEqual({ similarity: DatabaseUtil.SIMILARLY_TYPE_POSSIBLE_MATCH, identical: false });
    for (id of matchIDs) {
        if (id != -1) {
            expect(usedIDs).toContain(id);
        }
    }

    nonStoredApartments = generateTestApartments(6);
    storedApartments = generateTestApartments(6);
    matchIDs = Array(nonStoredApartments.length).fill(-1);
    usedIDs = [];
    nonStoredApartments[1].status = "UPDATED";
    matchIDs[1] = 3;
    usedIDs.push(3);
    expect(DatabaseUtil.n_findApartmentMappingLevel(storedApartments, nonStoredApartments, DatabaseUtil.SIMILARLY_TYPE_COMPATIBLE, matchIDs, usedIDs)).toStrictEqual({ similarity: DatabaseUtil.SIMILARLY_TYPE_COMPATIBLE, identical: false });
    for (id of matchIDs) {
        if (id != -1) {
            expect(usedIDs).toContain(id);
        }
    }

    nonStoredApartments = generateTestApartments(6);
    storedApartments = generateTestApartments(6);
    matchIDs = Array(nonStoredApartments.length).fill(-1);
    usedIDs = [];
    expect(DatabaseUtil.n_findApartmentMappingLevel(storedApartments, nonStoredApartments, DatabaseUtil.SIMILARLY_TYPE_COMPATIBLE, matchIDs, usedIDs)).toStrictEqual({ similarity: DatabaseUtil.SIMILARLY_TYPE_COMPATIBLE, identical: true });
    for (id of matchIDs) {
        if (id != -1) {
            expect(usedIDs).toContain(id);
        }
    }

    nonStoredApartments = generateTestApartments(6);
    storedApartments = generateTestApartments(6);
    matchIDs = Array(nonStoredApartments.length).fill(-1);
    usedIDs = [];
    matchIDs[1] = 3;
    usedIDs.push(3);
    expect(DatabaseUtil.n_findApartmentMappingLevel(storedApartments, nonStoredApartments, DatabaseUtil.SIMILARLY_TYPE_COMPATIBLE, matchIDs, usedIDs)).toStrictEqual({ similarity: DatabaseUtil.SIMILARLY_TYPE_COMPATIBLE, identical: true });
    for (id of matchIDs) {
        if (id != -1) {
            expect(usedIDs).toContain(id);
        }
    }
})

test("n_compareBuilding", () => {
    let bu_a = new Types.Building();
    let bu_b = new Types.Building();
    expect(DatabaseUtil.n_compareBuilding(bu_a, bu_b)).toStrictEqual({ similarity: DatabaseUtil.SIMILARLY_TYPE_COMPATIBLE, identical: true });

    bu_a.databaseID = 1;
    expect(DatabaseUtil.n_compareBuilding(bu_a, bu_b)).toStrictEqual({ similarity: DatabaseUtil.SIMILARLY_TYPE_COMPATIBLE, identical: true });

    bu_b.databaseID = 1;
    expect(DatabaseUtil.n_compareBuilding(bu_a, bu_b)).toStrictEqual({ similarity: DatabaseUtil.SIMILARLY_TYPE_COMPATIBLE, identical: true });

    bu_a.databaseID = -1;
    expect(DatabaseUtil.n_compareBuilding(bu_a, bu_b)).toStrictEqual({ similarity: DatabaseUtil.SIMILARLY_TYPE_COMPATIBLE, identical: true });

    bu_a.stories = 5;
    expect(DatabaseUtil.n_compareBuilding(bu_a, bu_b)).toStrictEqual({ similarity: DatabaseUtil.SIMILARLY_TYPE_COMPATIBLE, identical: false });

    bu_b.stories = 5;
    expect(DatabaseUtil.n_compareBuilding(bu_a, bu_b)).toStrictEqual({ similarity: DatabaseUtil.SIMILARLY_TYPE_COMPATIBLE, identical: true });

    bu_b.stories = 6;
    expect(DatabaseUtil.n_compareBuilding(bu_a, bu_b)).toStrictEqual({ similarity: DatabaseUtil.SIMILARLY_TYPE_MISMATCH, identical: false });

    bu_a.stories = null;
    expect(DatabaseUtil.n_compareBuilding(bu_a, bu_b)).toStrictEqual({ similarity: DatabaseUtil.SIMILARLY_TYPE_COMPATIBLE, identical: false });

    bu_b.stories = null;
    expect(DatabaseUtil.n_compareBuilding(bu_a, bu_b)).toStrictEqual({ similarity: DatabaseUtil.SIMILARLY_TYPE_COMPATIBLE, identical: true });

    bu_b.name = "test";
    expect(DatabaseUtil.n_compareBuilding(bu_a, bu_b)).toStrictEqual({ similarity: DatabaseUtil.SIMILARLY_TYPE_COMPATIBLE, identical: false });

    bu_b.name = "test2";
    expect(DatabaseUtil.n_compareBuilding(bu_a, bu_b)).toStrictEqual({ similarity: DatabaseUtil.SIMILARLY_TYPE_COMPATIBLE, identical: false });

    bu_a.name = "test2";
    expect(DatabaseUtil.n_compareBuilding(bu_a, bu_b)).toStrictEqual({ similarity: DatabaseUtil.SIMILARLY_TYPE_COMPATIBLE, identical: true });

    bu_a.address = "123 street";
    expect(DatabaseUtil.n_compareBuilding(bu_a, bu_b)).toStrictEqual({ similarity: DatabaseUtil.SIMILARLY_TYPE_COMPATIBLE, identical: false });

    bu_b.address = "124 street";
    expect(DatabaseUtil.n_compareBuilding(bu_a, bu_b)).toStrictEqual({ similarity: DatabaseUtil.SIMILARLY_TYPE_COMPATIBLE, identical: false });

    bu_b.address = "123 street4";
    expect(DatabaseUtil.n_compareBuilding(bu_a, bu_b)).toStrictEqual({ similarity: DatabaseUtil.SIMILARLY_TYPE_POSSIBLE_MATCH, identical: false });

    bu_a.name = "test23";
    expect(DatabaseUtil.n_compareBuilding(bu_a, bu_b)).toStrictEqual({ similarity: DatabaseUtil.SIMILARLY_TYPE_POSSIBLE_MATCH, identical: false });

    bu_a = new Types.Building();
    bu_b = new Types.Building();
    expect(DatabaseUtil.n_compareBuilding(bu_a, bu_b)).toStrictEqual({ similarity: DatabaseUtil.SIMILARLY_TYPE_COMPATIBLE, identical: true });

    bu_a.stories = 5;
    expect(DatabaseUtil.n_compareBuilding(bu_a, bu_b)).toStrictEqual({ similarity: DatabaseUtil.SIMILARLY_TYPE_COMPATIBLE, identical: false });

    bu_b.name = "test";
    expect(DatabaseUtil.n_compareBuilding(bu_a, bu_b)).toStrictEqual({ similarity: DatabaseUtil.SIMILARLY_TYPE_COMPATIBLE, identical: false });

    bu_a.name = "test";
    expect(DatabaseUtil.n_compareBuilding(bu_a, bu_b)).toStrictEqual({ similarity: DatabaseUtil.SIMILARLY_TYPE_COMPATIBLE, identical: false });

    bu_b.address = "123 f";
    expect(DatabaseUtil.n_compareBuilding(bu_a, bu_b)).toStrictEqual({ similarity: DatabaseUtil.SIMILARLY_TYPE_COMPATIBLE, identical: false });

    bu_a.address = "123 f";
    expect(DatabaseUtil.n_compareBuilding(bu_a, bu_b)).toStrictEqual({ similarity: DatabaseUtil.SIMILARLY_TYPE_POSSIBLE_MATCH, identical: false });

    // TODO
    // bu_a.address = "123 fa";
    // expect(DatabaseUtil.n_compareBuilding(bu_a, bu_b)).toStrictEqual({ similarity: DatabaseUtil.SIMILARLY_TYPE_MISMATCH, identical: false });

    bu_a.address = "123 f";
    expect(DatabaseUtil.n_compareBuilding(bu_a, bu_b)).toStrictEqual({ similarity: DatabaseUtil.SIMILARLY_TYPE_POSSIBLE_MATCH, identical: false });

    bu_a = new Types.Building();
    bu_b = new Types.Building();
    bu_a.name = "name";
    bu_a.address = "123 f";
    bu_b.name = "name";
    bu_b.address = "123 f";
    expect(DatabaseUtil.n_compareBuilding(bu_a, bu_b)).toStrictEqual({ similarity: DatabaseUtil.SIMILARLY_TYPE_POSSIBLE_MATCH, identical: true });

    bu_a = new Types.Building();
    bu_b = new Types.Building();
    bu_a.name = "name";
    bu_a.address = "123 f";
    bu_b.name = "name";
    bu_b.address = "123 f";
    expect(DatabaseUtil.n_compareBuilding(bu_a, bu_b)).toStrictEqual({ similarity: DatabaseUtil.SIMILARLY_TYPE_POSSIBLE_MATCH, identical: true });

    bu_a = new Types.Building();
    bu_b = new Types.Building();
    bu_a.stations = generateTestStations(2);
    bu_b.stations = generateTestStations(2);
    expect(DatabaseUtil.n_compareBuilding(bu_a, bu_b)).toStrictEqual({ similarity: DatabaseUtil.SIMILARLY_TYPE_COMPATIBLE, identical: true });

    bu_a = new Types.Building();
    bu_b = new Types.Building();
    bu_a.stations = generateTestStations(3);
    bu_b.stations = generateTestStations(2);
    expect(DatabaseUtil.n_compareBuilding(bu_a, bu_b)).toStrictEqual({ similarity: DatabaseUtil.SIMILARLY_TYPE_COMPATIBLE, identical: false });

    bu_a = new Types.Building();
    bu_b = new Types.Building();
    bu_a.stations = generateTestStations(2);
    bu_b.stations = generateTestStations(3);
    expect(DatabaseUtil.n_compareBuilding(bu_a, bu_b)).toStrictEqual({ similarity: DatabaseUtil.SIMILARLY_TYPE_COMPATIBLE, identical: false });

    bu_a = new Types.Building();
    bu_b = new Types.Building();
    bu_a.stations = generateTestStations(2);
    bu_b.stations = generateTestStations(2);
    bu_b.stations[0].distance = 1;
    expect(DatabaseUtil.n_compareBuilding(bu_a, bu_b)).toStrictEqual({ similarity: DatabaseUtil.SIMILARLY_TYPE_COMPATIBLE, identical: false });

    // Case where the name included the apartment number
    // Case where there is a station mismatch
})

test("n_compareStations", () => {
    let nonStoredStations = generateTestStations(4);
    let storedStations = generateTestStations(2);
    let matchIDs = Array(nonStoredStations.length).fill(-1);
    let usedIDs = [];
    expect(DatabaseUtil.n_compareStations(storedStations, nonStoredStations, matchIDs, usedIDs)).toStrictEqual({ similarity: DatabaseUtil.SIMILARLY_TYPE_POSSIBLE_MATCH, identical: false });
    expect(matchIDs[0]).toBe(0);
    expect(matchIDs[1]).toBe(1);
    expect(matchIDs[2]).toBe(-1);
    expect(matchIDs[3]).toBe(-1);
    expect(usedIDs[0]).toBe(0);
    expect(usedIDs[1]).toBe(1);

    nonStoredStations = generateTestStations(2);
    storedStations = generateTestStations(4);
    matchIDs = Array(nonStoredStations.length).fill(-1);
    usedIDs = [];
    expect(DatabaseUtil.n_compareStations(storedStations, nonStoredStations, matchIDs, usedIDs)).toStrictEqual({ similarity: DatabaseUtil.SIMILARLY_TYPE_POSSIBLE_MATCH, identical: false });
    expect(matchIDs[0]).toBe(0);
    expect(matchIDs[1]).toBe(1);
    expect(usedIDs[0]).toBe(0);
    expect(usedIDs[1]).toBe(1);


    nonStoredStations = generateTestStations(2);
    storedStations = generateTestStations(2);
    matchIDs = Array(nonStoredStations.length).fill(-1);
    usedIDs = [];
    expect(DatabaseUtil.n_compareStations(storedStations, nonStoredStations, matchIDs, usedIDs)).toStrictEqual({ similarity: DatabaseUtil.SIMILARLY_TYPE_POSSIBLE_MATCH, identical: true });
    expect(matchIDs[0]).toBe(0);
    expect(matchIDs[1]).toBe(1);
    expect(usedIDs[0]).toBe(0);
    expect(usedIDs[1]).toBe(1);


    nonStoredStations = generateTestStations(2);
    storedStations = generateTestStations(2);
    matchIDs = Array(nonStoredStations.length).fill(-1);
    usedIDs = [];
    nonStoredStations[0].line = "x";
    expect(DatabaseUtil.n_compareStations(storedStations, nonStoredStations, matchIDs, usedIDs)).toStrictEqual({ similarity: DatabaseUtil.SIMILARLY_TYPE_POSSIBLE_MATCH, identical: false });
    expect(matchIDs[0]).toBe(-1);
    expect(matchIDs[1]).toBe(1);
    expect(usedIDs[0]).toBe(1);

    nonStoredStations = generateTestStations(2);
    storedStations = generateTestStations(2);
    matchIDs = Array(nonStoredStations.length).fill(-1);
    usedIDs = [];
    storedStations[0].station = "x";
    expect(DatabaseUtil.n_compareStations(storedStations, nonStoredStations, matchIDs, usedIDs)).toStrictEqual({ similarity: DatabaseUtil.SIMILARLY_TYPE_POSSIBLE_MATCH, identical: false });
    expect(matchIDs[0]).toBe(-1);
    expect(matchIDs[1]).toBe(1);
    expect(usedIDs[0]).toBe(1);

    nonStoredStations = generateTestStations(2);
    storedStations = generateTestStations(2);
    matchIDs = Array(nonStoredStations.length).fill(-1);
    usedIDs = [];
    nonStoredStations[0].distance = 8;
    expect(DatabaseUtil.n_compareStations(storedStations, nonStoredStations, matchIDs, usedIDs)).toStrictEqual({ similarity: DatabaseUtil.SIMILARLY_TYPE_MISMATCH, identical: false });

    nonStoredStations = generateTestStations(2);
    storedStations = generateTestStations(2);
    matchIDs = Array(nonStoredStations.length).fill(-1);
    usedIDs = [];
    nonStoredStations[1].distance = 8;
    expect(DatabaseUtil.n_compareStations(storedStations, nonStoredStations, matchIDs, usedIDs)).toStrictEqual({ similarity: DatabaseUtil.SIMILARLY_TYPE_COMPATIBLE, identical: false });
    expect(matchIDs[0]).toBe(0);
    expect(matchIDs[1]).toBe(1);
    expect(usedIDs[0]).toBe(0);
    expect(usedIDs[1]).toBe(1);

    // TODO cases are missing here
    // same line but different station
    // non aligned case
})

test("n_mergeApartment", () => {
    let store = new Types.Apartment();
    let nonStored = new Types.Apartment();
    store.price = 500;
    nonStored.price = 400;
    expect(() => DatabaseUtil.n_mergeApartment(store, nonStored)).toThrow("Trying to merge incompatible apartments");

    store = new Types.Apartment();
    nonStored = new Types.Apartment();
    store.price = 500;
    DatabaseUtil.n_mergeApartment(store, nonStored)
    expect(store.price).toBe(500);
    expect(nonStored.price).toBe(undefined);

    store = new Types.Apartment();
    nonStored = new Types.Apartment();
    nonStored.price = 500;
    DatabaseUtil.n_mergeApartment(store, nonStored)
    expect(store.price).toBe(500);
    expect(nonStored.price).toBe(500);

    store = new Types.Apartment();
    nonStored = new Types.Apartment();
    nonStored.databaseID = 500;
    DatabaseUtil.n_mergeApartment(store, nonStored)
    expect(store.databaseID).toBe(-1);
    expect(nonStored.databaseID).toBe(500);

    store = new Types.Apartment();
    nonStored = new Types.Apartment();
    store.databaseID = 500;
    DatabaseUtil.n_mergeApartment(store, nonStored)
    expect(store.databaseID).toBe(500);
    expect(nonStored.databaseID).toBe(-1);

    store = new Types.Apartment();
    nonStored = new Types.Apartment();
    store.status = "TEST";
    DatabaseUtil.n_mergeApartment(store, nonStored)
    expect(store.status).toBe("TEST");
    expect(nonStored.status).toBe(undefined);

    store = new Types.Apartment();
    nonStored = new Types.Apartment();
    nonStored.status = "TEST";
    DatabaseUtil.n_mergeApartment(store, nonStored)
    expect(store.status).toBe("TEST");
    expect(nonStored.status).toBe("TEST");

    store = new Types.Apartment();
    nonStored = new Types.Apartment();
    store.status = "TEST";
    nonStored.status = "TEST2";
    DatabaseUtil.n_mergeApartment(store, nonStored)
    expect(store.status).toBe("TEST2");
    expect(nonStored.status).toBe("TEST2");
})

test("n_compareApartment", () => {
    let app_a = new Types.Apartment();
    let app_b = new Types.Apartment();
    expect(DatabaseUtil.n_compareApartment(app_a, app_b)).toStrictEqual({ similarity: DatabaseUtil.SIMILARLY_TYPE_COMPATIBLE, identical: true });

    app_a.databaseID = 1;
    expect(DatabaseUtil.n_compareApartment(app_a, app_b)).toStrictEqual({ similarity: DatabaseUtil.SIMILARLY_TYPE_COMPATIBLE, identical: true });

    app_b.databaseID = 1;
    expect(DatabaseUtil.n_compareApartment(app_a, app_b)).toStrictEqual({ similarity: DatabaseUtil.SIMILARLY_TYPE_COMPATIBLE, identical: true });

    app_a.databaseID = -1;
    expect(DatabaseUtil.n_compareApartment(app_a, app_b)).toStrictEqual({ similarity: DatabaseUtil.SIMILARLY_TYPE_COMPATIBLE, identical: true });

    app_a.IDs[SITE_SUUMO] = String(5);
    expect(DatabaseUtil.n_compareApartment(app_a, app_b)).toStrictEqual({ similarity: DatabaseUtil.SIMILARLY_TYPE_COMPATIBLE, identical: false });

    app_b.IDs[SITE_SUUMO] = String(6);
    expect(DatabaseUtil.n_compareApartment(app_a, app_b)).toStrictEqual({ similarity: DatabaseUtil.SIMILARLY_TYPE_MISMATCH, identical: false });

    app_b.IDs[SITE_SUUMO] = String(5);
    expect(DatabaseUtil.n_compareApartment(app_a, app_b)).toStrictEqual({ similarity: DatabaseUtil.SIMILARLY_TYPE_ID_MATCH, identical: true });

    app_b.price = 500;
    expect(DatabaseUtil.n_compareApartment(app_a, app_b)).toStrictEqual({ similarity: DatabaseUtil.SIMILARLY_TYPE_ID_MATCH, identical: false });

    app_a.price = 400;
    expect(() => DatabaseUtil.n_compareApartment(app_a, app_b)).toThrow("An ID matched apartment has mismatching data");

    app_a.IDs[SITE_SUUMO] = null;
    app_b.IDs[SITE_SUUMO] = null;
    expect(DatabaseUtil.n_compareApartment(app_a, app_b)).toStrictEqual({ similarity: DatabaseUtil.SIMILARLY_TYPE_MISMATCH, identical: false });

    app_b.price = 400;
    expect(DatabaseUtil.n_compareApartment(app_a, app_b)).toStrictEqual({ similarity: DatabaseUtil.SIMILARLY_TYPE_COMPATIBLE, identical: true });

    app_a.layout = "lLDK";
    app_a.size = 25;
    expect(DatabaseUtil.n_compareApartment(app_a, app_b)).toStrictEqual({ similarity: DatabaseUtil.SIMILARLY_TYPE_COMPATIBLE, identical: false });

    app_b.layout = "lLDK";
    app_b.size = 25;
    expect(DatabaseUtil.n_compareApartment(app_a, app_b)).toStrictEqual({ similarity: DatabaseUtil.SIMILARLY_TYPE_POSSIBLE_MATCH, identical: true });

    app_b.keyMoney = 1000;
    expect(DatabaseUtil.n_compareApartment(app_a, app_b)).toStrictEqual({ similarity: DatabaseUtil.SIMILARLY_TYPE_POSSIBLE_MATCH, identical: false });

    app_b.size = 25.5;
    expect(DatabaseUtil.n_compareApartment(app_a, app_b)).toStrictEqual({ similarity: DatabaseUtil.SIMILARLY_TYPE_MISMATCH, identical: false });

    app_b.size = "25";
    expect(DatabaseUtil.n_compareApartment(app_a, app_b)).toStrictEqual({ similarity: DatabaseUtil.SIMILARLY_TYPE_POSSIBLE_MATCH, identical: false });
})

test("n_compareAttribute_int_individual", () => {
    let attResult = {
        allIdentical: true, mismatch: false, anyNotNullIdentical: false
    };
    let a = null;
    let b = null;
    DatabaseUtil.n_compareAttribute(a, b, attResult);
    expect(attResult.allIdentical).toBe(true);
    expect(attResult.mismatch).toBe(false);
    expect(attResult.anyNotNullIdentical).toBe(false);
    attResult.allIdentical = false;
    attResult.mismatch = true;
    attResult.anyNotNullIdentical = true;
    DatabaseUtil.n_compareAttribute(a, b, attResult);
    expect(attResult.allIdentical).toBe(false);
    expect(attResult.mismatch).toBe(true);
    expect(attResult.anyNotNullIdentical).toBe(true);

    attResult = {
        allIdentical: true, mismatch: false, anyNotNullIdentical: false
    };
    a = 1;
    b = null;
    DatabaseUtil.n_compareAttribute(a, b, attResult);
    expect(attResult.allIdentical).toBe(false);
    expect(attResult.mismatch).toBe(false);
    expect(attResult.anyNotNullIdentical).toBe(false);
    attResult.allIdentical = false;
    attResult.mismatch = true;
    attResult.anyNotNullIdentical = true;
    DatabaseUtil.n_compareAttribute(a, b, attResult);
    expect(attResult.allIdentical).toBe(false);
    expect(attResult.mismatch).toBe(true);
    expect(attResult.anyNotNullIdentical).toBe(true);

    attResult = {
        allIdentical: true, mismatch: false, anyNotNullIdentical: false
    };
    a = null;
    b = 1;
    DatabaseUtil.n_compareAttribute(a, b, attResult);
    expect(attResult.allIdentical).toBe(false);
    expect(attResult.mismatch).toBe(false);
    expect(attResult.anyNotNullIdentical).toBe(false);
    attResult.allIdentical = false;
    attResult.mismatch = true;
    attResult.anyNotNullIdentical = true;
    DatabaseUtil.n_compareAttribute(a, b, attResult);
    expect(attResult.allIdentical).toBe(false);
    expect(attResult.mismatch).toBe(true);
    expect(attResult.anyNotNullIdentical).toBe(true);

    attResult = {
        allIdentical: true, mismatch: false, anyNotNullIdentical: false
    };
    a = 2;
    b = 1;
    DatabaseUtil.n_compareAttribute(a, b, attResult);
    expect(attResult.allIdentical).toBe(false);
    expect(attResult.mismatch).toBe(true);
    expect(attResult.anyNotNullIdentical).toBe(false);
    attResult.allIdentical = false;
    attResult.mismatch = true;
    attResult.anyNotNullIdentical = true;
    DatabaseUtil.n_compareAttribute(a, b, attResult);
    expect(attResult.allIdentical).toBe(false);
    expect(attResult.mismatch).toBe(true);
    expect(attResult.anyNotNullIdentical).toBe(true);

    attResult = {
        allIdentical: true, mismatch: false, anyNotNullIdentical: false
    };
    a = 1;
    b = 1;
    DatabaseUtil.n_compareAttribute(a, b, attResult);
    expect(attResult.allIdentical).toBe(true);
    expect(attResult.mismatch).toBe(false);
    expect(attResult.anyNotNullIdentical).toBe(true);
    attResult.allIdentical = false;
    attResult.mismatch = true;
    attResult.anyNotNullIdentical = true;
    DatabaseUtil.n_compareAttribute(a, b, attResult);
    expect(attResult.allIdentical).toBe(false);
    expect(attResult.mismatch).toBe(true);
    expect(attResult.anyNotNullIdentical).toBe(true);
})

test("n_compareAttribute_int_sequence", () => {
    let attResult = {
        allIdentical: true, mismatch: false, anyNotNullIdentical: false
    };
    let a = null;
    let b = null;
    DatabaseUtil.n_compareAttribute(a, b, attResult);
    expect(attResult.allIdentical).toBe(true);
    expect(attResult.mismatch).toBe(false);
    expect(attResult.anyNotNullIdentical).toBe(false);

    a = 2;
    b = 2;
    DatabaseUtil.n_compareAttribute(a, b, attResult);
    expect(attResult.allIdentical).toBe(true);
    expect(attResult.mismatch).toBe(false);
    expect(attResult.anyNotNullIdentical).toBe(true);

    a = null;
    b = null;
    DatabaseUtil.n_compareAttribute(a, b, attResult);
    expect(attResult.allIdentical).toBe(true);
    expect(attResult.mismatch).toBe(false);
    expect(attResult.anyNotNullIdentical).toBe(true);

    a = 1;
    b = null;
    DatabaseUtil.n_compareAttribute(a, b, attResult);
    expect(attResult.allIdentical).toBe(false);
    expect(attResult.mismatch).toBe(false);
    expect(attResult.anyNotNullIdentical).toBe(true);

    a = null;
    b = 1;
    DatabaseUtil.n_compareAttribute(a, b, attResult);
    expect(attResult.allIdentical).toBe(false);
    expect(attResult.mismatch).toBe(false);
    expect(attResult.anyNotNullIdentical).toBe(true);

    a = 2;
    b = 1;
    DatabaseUtil.n_compareAttribute(a, b, attResult);
    expect(attResult.allIdentical).toBe(false);
    expect(attResult.mismatch).toBe(true);
    expect(attResult.anyNotNullIdentical).toBe(true);
})

test("n_compareAttribute_string_individual", () => {
    let attResult = {
        allIdentical: true, mismatch: false, anyNotNullIdentical: false
    };
    let a = null;
    let b = null;
    DatabaseUtil.n_compareAttribute(a, b, attResult);
    expect(attResult.allIdentical).toBe(true);
    expect(attResult.mismatch).toBe(false);
    expect(attResult.anyNotNullIdentical).toBe(false);
    attResult.allIdentical = false;
    attResult.mismatch = true;
    attResult.anyNotNullIdentical = true;
    DatabaseUtil.n_compareAttribute(a, b, attResult);
    expect(attResult.allIdentical).toBe(false);
    expect(attResult.mismatch).toBe(true);
    expect(attResult.anyNotNullIdentical).toBe(true);

    attResult = {
        allIdentical: true, mismatch: false, anyNotNullIdentical: false
    };
    a = "1";
    b = null;
    DatabaseUtil.n_compareAttribute(a, b, attResult);
    expect(attResult.allIdentical).toBe(false);
    expect(attResult.mismatch).toBe(false);
    expect(attResult.anyNotNullIdentical).toBe(false);
    attResult.allIdentical = false;
    attResult.mismatch = true;
    attResult.anyNotNullIdentical = true;
    DatabaseUtil.n_compareAttribute(a, b, attResult);
    expect(attResult.allIdentical).toBe(false);
    expect(attResult.mismatch).toBe(true);
    expect(attResult.anyNotNullIdentical).toBe(true);

    attResult = {
        allIdentical: true, mismatch: false, anyNotNullIdentical: false
    };
    a = null;
    b = "1";
    DatabaseUtil.n_compareAttribute(a, b, attResult);
    expect(attResult.allIdentical).toBe(false);
    expect(attResult.mismatch).toBe(false);
    expect(attResult.anyNotNullIdentical).toBe(false);
    attResult.allIdentical = false;
    attResult.mismatch = true;
    attResult.anyNotNullIdentical = true;
    DatabaseUtil.n_compareAttribute(a, b, attResult);
    expect(attResult.allIdentical).toBe(false);
    expect(attResult.mismatch).toBe(true);
    expect(attResult.anyNotNullIdentical).toBe(true);

    attResult = {
        allIdentical: true, mismatch: false, anyNotNullIdentical: false
    };
    a = "2";
    b = "1";
    DatabaseUtil.n_compareAttribute(a, b, attResult);
    expect(attResult.allIdentical).toBe(false);
    expect(attResult.mismatch).toBe(true);
    expect(attResult.anyNotNullIdentical).toBe(false);
    attResult.allIdentical = false;
    attResult.mismatch = true;
    attResult.anyNotNullIdentical = true;
    DatabaseUtil.n_compareAttribute(a, b, attResult);
    expect(attResult.allIdentical).toBe(false);
    expect(attResult.mismatch).toBe(true);
    expect(attResult.anyNotNullIdentical).toBe(true);

    attResult = {
        allIdentical: true, mismatch: false, anyNotNullIdentical: false
    };
    a = "1";
    b = "1";
    DatabaseUtil.n_compareAttribute(a, b, attResult);
    expect(attResult.allIdentical).toBe(true);
    expect(attResult.mismatch).toBe(false);
    expect(attResult.anyNotNullIdentical).toBe(true);
    attResult.allIdentical = false;
    attResult.mismatch = true;
    attResult.anyNotNullIdentical = true;
    DatabaseUtil.n_compareAttribute(a, b, attResult);
    expect(attResult.allIdentical).toBe(false);
    expect(attResult.mismatch).toBe(true);
    expect(attResult.anyNotNullIdentical).toBe(true);
})

test("n_compareAttribute_string_sequence", () => {
    let attResult = {
        allIdentical: true, mismatch: false, anyNotNullIdentical: false
    };
    let a = null;
    let b = null;
    DatabaseUtil.n_compareAttribute(a, b, attResult);
    expect(attResult.allIdentical).toBe(true);
    expect(attResult.mismatch).toBe(false);
    expect(attResult.anyNotNullIdentical).toBe(false);

    a = "2";
    b = "2";
    DatabaseUtil.n_compareAttribute(a, b, attResult);
    expect(attResult.allIdentical).toBe(true);
    expect(attResult.mismatch).toBe(false);
    expect(attResult.anyNotNullIdentical).toBe(true);

    a = null;
    b = null;
    DatabaseUtil.n_compareAttribute(a, b, attResult);
    expect(attResult.allIdentical).toBe(true);
    expect(attResult.mismatch).toBe(false);
    expect(attResult.anyNotNullIdentical).toBe(true);

    a = "1";
    b = null;
    DatabaseUtil.n_compareAttribute(a, b, attResult);
    expect(attResult.allIdentical).toBe(false);
    expect(attResult.mismatch).toBe(false);
    expect(attResult.anyNotNullIdentical).toBe(true);

    a = null;
    b = "1";
    DatabaseUtil.n_compareAttribute(a, b, attResult);
    expect(attResult.allIdentical).toBe(false);
    expect(attResult.mismatch).toBe(false);
    expect(attResult.anyNotNullIdentical).toBe(true);

    a = "2";
    b = "1";
    DatabaseUtil.n_compareAttribute(a, b, attResult);
    expect(attResult.allIdentical).toBe(false);
    expect(attResult.mismatch).toBe(true);
    expect(attResult.anyNotNullIdentical).toBe(true);
})

test("n_compareAttribute_apartment_int_individual", () => {
    let attResult = {
        allIdentical: true, mismatch: false, anyNotNullIdentical: false
    };
    let app_a = new Types.Apartment();
    let app_b = new Types.Apartment();
    DatabaseUtil.n_compareAttribute(app_a.price, app_b.price, attResult);
    expect(attResult.allIdentical).toBe(true);
    expect(attResult.mismatch).toBe(false);
    expect(attResult.anyNotNullIdentical).toBe(false);
    attResult.allIdentical = false;
    attResult.mismatch = true;
    attResult.anyNotNullIdentical = true;
    DatabaseUtil.n_compareAttribute(app_a.price, app_b.price, attResult);
    expect(attResult.allIdentical).toBe(false);
    expect(attResult.mismatch).toBe(true);
    expect(attResult.anyNotNullIdentical).toBe(true);

    attResult = {
        allIdentical: true, mismatch: false, anyNotNullIdentical: false
    };
    app_a.price = 1;
    app_b.price = null;
    DatabaseUtil.n_compareAttribute(app_a.price, app_b.price, attResult);
    expect(attResult.allIdentical).toBe(false);
    expect(attResult.mismatch).toBe(false);
    expect(attResult.anyNotNullIdentical).toBe(false);
    attResult.allIdentical = false;
    attResult.mismatch = true;
    attResult.anyNotNullIdentical = true;
    DatabaseUtil.n_compareAttribute(app_a.price, app_b.price, attResult);
    expect(attResult.allIdentical).toBe(false);
    expect(attResult.mismatch).toBe(true);
    expect(attResult.anyNotNullIdentical).toBe(true);

    attResult = {
        allIdentical: true, mismatch: false, anyNotNullIdentical: false
    };
    app_a.price = null;
    app_b.price = 1;
    DatabaseUtil.n_compareAttribute(app_a.price, app_b.price, attResult);
    expect(attResult.allIdentical).toBe(false);
    expect(attResult.mismatch).toBe(false);
    expect(attResult.anyNotNullIdentical).toBe(false);
    attResult.allIdentical = false;
    attResult.mismatch = true;
    attResult.anyNotNullIdentical = true;
    DatabaseUtil.n_compareAttribute(app_a.price, app_b.price, attResult);
    expect(attResult.allIdentical).toBe(false);
    expect(attResult.mismatch).toBe(true);
    expect(attResult.anyNotNullIdentical).toBe(true);

    attResult = {
        allIdentical: true, mismatch: false, anyNotNullIdentical: false
    };
    app_a.price = 2;
    app_b.price = 1;
    DatabaseUtil.n_compareAttribute(app_a.price, app_b.price, attResult);
    expect(attResult.allIdentical).toBe(false);
    expect(attResult.mismatch).toBe(true);
    expect(attResult.anyNotNullIdentical).toBe(false);
    attResult.allIdentical = false;
    attResult.mismatch = true;
    attResult.anyNotNullIdentical = true;
    DatabaseUtil.n_compareAttribute(app_a.price, app_b.price, attResult);
    expect(attResult.allIdentical).toBe(false);
    expect(attResult.mismatch).toBe(true);
    expect(attResult.anyNotNullIdentical).toBe(true);

    attResult = {
        allIdentical: true, mismatch: false, anyNotNullIdentical: false
    };
    app_a.price = 1;
    app_b.price = 1;
    DatabaseUtil.n_compareAttribute(app_a.price, app_b.price, attResult);
    expect(attResult.allIdentical).toBe(true);
    expect(attResult.mismatch).toBe(false);
    expect(attResult.anyNotNullIdentical).toBe(true);
    attResult.allIdentical = false;
    attResult.mismatch = true;
    attResult.anyNotNullIdentical = true;
    DatabaseUtil.n_compareAttribute(app_a.price, app_b.price, attResult);
    expect(attResult.allIdentical).toBe(false);
    expect(attResult.mismatch).toBe(true);
    expect(attResult.anyNotNullIdentical).toBe(true);
})

test("n_idMapsToJson", () => {
    let database = new Types.FullData();
    database.apartmentIDMaps[2].set("234", { buildingID: 9, apartmentID: 15 });
    database.apartmentIDMaps[2].set("aaa", { buildingID: 2, apartmentID: 3 });

    let jsonArray = DatabaseUtil.n_idMapsToJson(database.apartmentIDMaps);
    let IDMap = DatabaseUtil.n_jsonToIDMaps(jsonArray);

    expect(IDMap[2].get("234").buildingID).toBe(9);
    expect(IDMap[2].get("234").apartmentID).toBe(15);
    expect(IDMap[2].get("aaa").buildingID).toBe(2);
    expect(IDMap[2].get("aaa").apartmentID).toBe(3);
})

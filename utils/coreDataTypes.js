class FullData {
    constructor() {
        this.coreData = [];
        this.suumoIDMap = new Map();
    }
}

class Station {
    constructor() {
        this.databaseID = -1;

        this.line;
        this.station;
        this.distance;
    }
}

class Apartment {
    constructor() {
        this.databaseID = -1;
        this.buildingDatabaseID = -1;

        this.status;

        this.price;
        this.managementFee;
        this.floor;
        this.deposit;
        this.keyMoney;
        this.layout;
        this.size;

        this.suumoBaseURL;
        this.suumoID;
    }
}

class Building {
    constructor() {
        this.databaseID = -1;

        this.status;

        this.name;
        this.address;
        this.age;
        this.stories;
        this.stations = [];
        this.apartments = [];

        this.suumoName;
        this.suumoAddress;
    }
}

// This does not work, i have no earthly idea why. God dam javascript...
// const DATABASE_KEY = "AllBuildings";

const REQUEST_PAGE_TYPE = "getPageType";
const REQUEST_PAGE_APARTMENT = "getApartment";

const PAGE_TYPE_APARTMENT = "Apartment";
const PAGE_TYPE_SEARCH = "Search";
const PAGE_TYPE_UNKNOWN = "Unknown";

if (typeof require === 'function') {
    module.exports = {
        FullData: FullData,
        Station: Station,
        Apartment: Apartment,
        Building: Building,
    };
}

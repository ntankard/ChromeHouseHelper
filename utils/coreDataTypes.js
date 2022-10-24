const MAX_SITE_NUM = 10;

const SITE_SUUMO = 0;
const SITE_RNT = 1;

class FullData {
    constructor() {
        this.coreData = [];
        this.apartmentIDMaps = Array.apply(null, Array(MAX_SITE_NUM)).map(x => new Map());
        this.buildingIDMaps = Array.apply(null, Array(MAX_SITE_NUM)).map(x => new Map());
    }
}

class Station {
    constructor() {
        // Database core
        this.databaseID = -1;

        // Fuzzy data
        this.distance;

        // Hard data
        this.line;
        this.station;
    }
}

class Apartment {
    constructor() {
        // Database core
        this.databaseID = -1;
        this.IDs = Array(10);

        // Hard data
        this.price;
        this.floor;
        this.deposit;
        this.keyMoney;
        this.layout;
        this.size;
        this.managementFee;

        // Sub Objects
        this.urls = Array(10);

        // User data
        this.status;
    }
}

class Building {
    constructor() {
        // Database core
        this.databaseID = -1;
        this.IDs = Array(10);
        this.siteType;

        // Fuzzy data
        this.name;
        this.address;
        this.englishName;

        // Hard data
        this.googleMapLink;
        this.stories;

        // Multi form data
        this.age;
        this.constructionDateMonth;
        this.constructionDateYear;

        // Sub Objects
        this.stations = [];
        this.apartments = [];

        // User data
        this.status;
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
        SITE_SUUMO: SITE_SUUMO,
        SITE_RNT: SITE_RNT,
    };
}

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
        this.databaseID = -1;

        this.line;
        this.station;
        this.distance;
    }
}

class Apartment {
    constructor() {
        this.databaseID = -1;

        this.status;

        this.price;
        this.managementFee;
        this.floor;
        this.deposit;
        this.keyMoney;
        this.layout;
        this.size;

        this.urls = Array(10);
        this.IDs = Array(10);
    }
}

class Building {
    constructor() {
        this.databaseID = -1;

        this.status;

        this.name;
        this.address;
        this.age;
        this.constructionDate; // TODO 
        this.stories;
        this.stations = [];
        this.apartments = [];

        this.englishName;
       
        this.googleMapLink;

        this.IDs = Array(10);
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

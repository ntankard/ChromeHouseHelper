class Station {
    constructor() {
        this.line;
        this.station;
        this.distance;
    }
}

class Building {
    constructor() {
        this.status = "NONE";
        this.name;
        this.address;
        this.age;
        this.stories;
        this.stations = [];
        this.apartments = [];
    }
}

class Apartment {
    constructor() {
        this.status = "NONE";
        this.price;
        this.managementFee;
        this.floor;
        this.deposit;
        this.keyMoney;
        this.layout;
        this.size;
        this.urls = [];
    }
}

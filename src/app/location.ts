export class Location {
    locationID: string;
    streetAddress: string;
    apartmentNumber: string;
    city: string;
    state: string;
    zipcode: string;
    capacity: number;
    locationType: string;
    address: string;
    eventNum: number;

    constructor(private field: Array<string>, private info: Array<string>) {
        if (field.length === 0) {
            this.locationID = info[0];
            this.streetAddress = info[1];
            this.apartmentNumber = info[2];
            this.city = info[3];
            this.state = info[4];
            this.zipcode = info[5];
            this.capacity = Number(info[6]);
            this.locationType = info[7];
            this.address = `${this.apartmentNumber} ${this.streetAddress}, ${this.city}, ${this.state}, ${this.zipcode}`;
        } else {
            info = info[0].toString().replace(/\(|\)|"/g, '')
                .split(',').map(String);
            field = field.map(f => f.replace('location\.', ''));
            if (field.indexOf('LocationID') !== -1) {
                this.locationID = info[field.indexOf('LocationID')];
            }
            if (field.indexOf('StreetAddress') !== -1) {
                this.streetAddress = info[field.indexOf('StreetAddress')];
            }
            if (field.indexOf('ApartmentNumber') !== -1) {
                this.apartmentNumber = info[field.indexOf('ApartmentNumber')];
            }
            if (field.indexOf('City') !== -1) {
                this.city = info[field.indexOf('City')];
            }
            if (field.indexOf('State') !== -1) {
                this.state = info[field.indexOf('State')];
            }
            if (field.indexOf('ZipCode') !== -1) {
                this.zipcode = info[field.indexOf('ZipCode')];
            }
            if (field.indexOf('Capacity') !== -1) {
                this.capacity = Number(info[field.indexOf('Capacity')]);
            }
            if (field.indexOf('LocationType') !== -1) {
                this.locationType = info[field.indexOf('LocationType')];
            }
        }
        this.eventNum = 0;
    }
}

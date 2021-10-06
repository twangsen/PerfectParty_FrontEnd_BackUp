import {Component, Inject, OnInit} from '@angular/core';
import {DbService} from '../db.service';
import {Location} from '../location';
import {loggedIn, userid} from '../login/login.component';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {FormControl, Validators} from '@angular/forms';


@Component({
    selector: 'app-adminlocation',
    templateUrl: './adminlocation.component.html',
    styleUrls: ['./adminlocation.component.css']
})
export class AdminlocationComponent implements OnInit {

    locations: Location[];
    selectedLocation: Location;
    tempLocation: Location;

    nextID: number;

    street = new FormControl('', [Validators.required]);
    ap = new FormControl('', [Validators.required]);
    city = new FormControl('', [Validators.required]);
    state = new FormControl('', [Validators.required]);
    zip = new FormControl('', [Validators.required]);
    cap = new FormControl('',
        [Validators.required,
            Validators.min(1), Validators.max(100000),
            Validators.pattern(new RegExp('^[0-9]*$'))]);

    /* search field */
    sID: string;
    sStreetAddress: string;
    sApartmentNumber: string;
    sCity: string;
    sState: string;
    sZipCode: string;
    sCapacity: string;
    sLocationType: string;
    sCapacityCompare: string;
    /* insert field */

    // iID: string;
    iStreetAddress: string;
    iApartmentNumber: string;
    iCity: string;
    iState: string;
    iZipCode: string;
    iCapacity: number;
    iLocationType: string;


    constructor(private dbservice: DbService, public dialog: MatDialog) { }

    ngOnInit() {
        this.getLocations();
        this.getNextID();
    }


    getNextID(): void {
        this.dbservice.findNextLocationID().subscribe(
            res => this.nextID = res
        );
    }

    openDialog(): void {
        const dialogRef = this.dialog.open(AdminlocationDialogComponent, {
            width: '600px',
            data: this.tempLocation
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
            console.log(result);
            if (result != null) {
                this.updateLocation();
            } else {
                this.selectedLocation = null;
            }
        });
    }

    valid(): boolean {
        return this.street.valid && this.ap.valid && this.city.valid && this.state.valid && this.zip.valid && this.cap.valid;
    }


    getErrorMessage(field: string) {
        if (field === 'street') {
            return this.street.hasError('required') ? 'You must enter a value' : '';
        }
        if (field === 'ap') {
            return this.ap.hasError('required') ? 'You must enter a value' : '';
        }
        if (field === 'city') {
            return this.city.hasError('required') ? 'You must enter a value' : '';
        }
        if (field === 'state') {
            return this.state.hasError('required') ? 'You must enter a value' : '';
        }
        if (field === 'zip') {
            return this.zip.hasError('required') ? 'You must enter a value' : '';
        }
        if (field === 'cap') {
            return this.cap.hasError('required') ? 'You must enter a value' :
                this.cap.hasError('min') ? 'Capacity must be >= 1' :
                    this.cap.hasError('max') ? 'Capacity must be <= 100000' :
                        this.cap.hasError('pattern') ? 'Capacity must be an int' : '';
        }
    }


    onSelect(location: Location): void {
        this.selectedLocation = location;
        this.tempLocation = Object.assign({}, location);
    }

    getLocations(): void {
        this.dbservice.getLocations().subscribe(
            locations => {
                locations.forEach(l => this.getEvents(l));
                this.locations = locations;
            }
        );
    }

    show(givenEid) {
        const x = document.getElementById(givenEid);
        if (x.style.display === 'none') {
            if (givenEid === 'search' || givenEid === 'insert') {
                x.style.display = 'inline-block';
            } else {
                x.style.display = 'block';
            }
        } else {
            x.style.display = 'none';
        }
        this.clearInput();
    }

    clearInput() {
        this.sID = null;
        this.sStreetAddress = null;
        this.sApartmentNumber = null;
        this.sCity = null;
        this.sState = null;
        this.sZipCode = null;
        this.sCapacity = null;
        this.sLocationType = null;
        this.sCapacityCompare = null;
        /* insert field */

        // this.iID = null;
        this.iStreetAddress = null;
        this.iApartmentNumber = null;
        this.iCity = null;
        this.iState = null;
        this.iZipCode = null;
        this.iCapacity = null;
        this.iLocationType = null;
    }

    insertLocation(): void {
        const intoPart = [
            'StreetAddress',
            'City',
            'State',
            'ZipCode',
            'Capacity',
            'LocationType'
        ];
        const valuesPart = [
            `\'${this.iStreetAddress}\'`,
            `\'${this.iCity}\'`,
            `\'${this.iState}\'`,
            `\'${this.iZipCode}\'`,
            `\'${this.iCapacity}\'`,
            `\'${this.iLocationType}\'`
        ];
        const requestBody = {
            'into': intoPart,
            'values': valuesPart
        };

        this.dbservice.insertLocation(requestBody).subscribe(
            // if no throw, then we will set user valid
            data => {
                alert(data);
                this.getLocations();
                this.getNextID();
            }
        );
    }


    searchLocations(): void {
        const wherePart = {};
        if (this.sID) {
            wherePart['LocationID'] = `=\'${this.sID}\'`;
        }
        if (this.sApartmentNumber) {
            wherePart['ApartmentNumber'] = `=\'${this.sApartmentNumber}\'`;
        }
        if (this.sStreetAddress) {
            wherePart['StreetAddress'] = `=\'${this.sStreetAddress}\'`;
        }
        if (this.sCity) {
            wherePart['City'] = `=\'${this.sCity}\'`;
        }
        if (this.sState) {
            wherePart['State'] = `=\'${this.sState}\'`;
        }
        if (this.sZipCode) {
            wherePart['ZipCode'] = `=\'${this.sZipCode}\'`;
        }
        if (this.sLocationType) {
            wherePart['LocationType'] = `=\'${this.sLocationType}\'`;
        }
        if (this.sCapacity && this.sCapacityCompare != null) {
            wherePart['supplier.Price'] = `${this.sCapacityCompare}${this.sCapacity.toString()}`;
        }
        const requestBody = {
            'where': wherePart
        };
        console.log(requestBody);
        this.dbservice.searchLocations(requestBody).subscribe(
            location => {
                location.forEach(l => this.getEvents(l));
                this.locations = location;
            }
        );
    }

    getEvents(location: Location): void {
        const locationID: string = location.locationID;
        const wherePart = {};
        wherePart['LocationID'] = `=\'${locationID}\'`;
        const requestBody = {
            'select': ['Count(*)'],
            'distinct': true,
            'from': {
                'select': ['event.EventID', 'event.LocationID'],
                'from': ['location', 'event'],
                'join': ' FULL OUTER JOIN ',
                'on': {
                    'event.LocationID': '=location.LocationID'
                }
            },
            'where': {
                'LocationID': `=\'${locationID}\'`
            }
        };
        this.dbservice.searchLocationsJoin(requestBody).subscribe(
            eventCount => {
                console.log(eventCount);
                location.eventNum = eventCount;
            }
        );
    }


    updateLocation() {
        console.log(this.tempLocation);
        if (JSON.stringify(this.selectedLocation) === JSON.stringify(this.tempLocation)) {
            this.selectedLocation = null;
            return;
        }
        const setPart = {};
        setPart['StreetAddress'] = `=\'${this.tempLocation.streetAddress}\'`;
        setPart['ApartmentNumber'] = `=\'${this.tempLocation.apartmentNumber}\'`;
        setPart['City'] = `=\'${this.tempLocation.city}\'`;
        setPart['State'] = `=\'${this.tempLocation.state}\'`;
        setPart['ZipCode'] = `=\'${this.tempLocation.zipcode}\'`;
        setPart['Capacity'] = `=\'${this.tempLocation.capacity}\'`;
        setPart['LocationType'] = `=\'${this.tempLocation.locationType}\'`;
        const wherePart = {};
        wherePart['LocationID'] = `=\'${this.tempLocation.locationID}\'`;
        const requestBody = {
            'set': setPart,
            'where': wherePart
        };
        console.log(requestBody);
        this.dbservice.updateLocation(requestBody).subscribe(
            data => {
                if (data.includes('correct')) {
                    Object.assign(this.selectedLocation, this.tempLocation);
                }
                alert('Update Done');
                // console.log(data);
            }
        );
    }

}


@Component({
    selector: 'app-adminlocation-dialog',
    templateUrl: './adminlocationdialog.component.html',
    styleUrls: ['./adminlocationdialog.component.css']
})
export class AdminlocationDialogComponent {

    street = new FormControl('', [Validators.required]);
    ap = new FormControl('', [Validators.required]);
    city = new FormControl('', [Validators.required]);
    state = new FormControl('', [Validators.required]);
    zip = new FormControl('', [Validators.required]);
    cap = new FormControl('',
        [Validators.required,
            Validators.min(1), Validators.max(100000),
            Validators.pattern(new RegExp('^[0-9]*$'))]);

    constructor(
        public dialogRef: MatDialogRef<AdminlocationDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: Location) {}

    onNoClick(): void {
        this.dialogRef.close();
    }

    valid(): boolean {
        return this.street.valid && this.ap.valid && this.city.valid && this.state.valid && this.zip.valid && this.cap.valid;
    }
    
    getErrorMessage(field: string) {
        if (field === 'street') {
            return this.street.hasError('required') ? 'You must enter a valid address' : '';
        }
        if (field === 'ap') {
            return this.ap.hasError('required') ? 'You must enter a value' : '';
        }
        if (field === 'city') {
            return this.city.hasError('required') ? 'You must enter a valid city' : '';
        }
        if (field === 'state') {
            return this.state.hasError('required') ? 'You must enter a valid state' : '';
        }
        if (field === 'zip') {
            return this.zip.hasError('required') ? 'You must enter a valid Zip code' : '';
        }
        if (field === 'cap') {
            return this.cap.hasError('required') ? 'You must enter a value' :
                this.cap.hasError('min') ? 'Capacity must be >= 1' :
                    this.cap.hasError('max') ? 'Capacity must be <= 100000' :
                        this.cap.hasError('pattern') ? 'Capacity must be an int' : '';
        }
    }

}

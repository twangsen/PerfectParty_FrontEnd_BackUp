import {Component, Inject, Input, OnChanges, OnInit, SimpleChange, SimpleChanges} from '@angular/core';
import {Event} from '../event';
import {Time} from '@angular/common';
import {DbService} from '../db.service';
import {Location} from '../location';
import {Supplier} from '../supplier';
import {userid} from '../login/login.component';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

export interface DataInterface {
  // tslint:disable-next-line:ban-types
  budget: Number;
  decor: Supplier[];
  entertain: Supplier[];
  catering: Supplier[];
  choose: Array<{
    supplierID: string,
    amount: number,
  }>;
}

let tempData: DataInterface = {
  budget: 0,
  decor: [],
  entertain: [],
  catering: [],
  choose: [],
};

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css']
})
export class BookComponent implements OnInit {

  b = new FormControl('',
      [Validators.required,
        Validators.min(0), Validators.max(10 ** 7),
        Validators.pattern(new RegExp('^[0-9]*$'))]);
  startD = new FormControl('', [Validators.required]);
  startT = new FormControl('', [Validators.required]);
  endD = new FormControl('', [Validators.required]);
  endT = new FormControl('', [Validators.required]);


  public tempEvent: Event;
  locations: Location[];
  selectedLocation: Location;

  /* date & time */
  SD: Date;
  ST: Time;
  ED: Date;
  ET: Time;
  tempSDate: string;
  tempEDate: string;

  constructor(private dbservice: DbService, public dialog: MatDialog) { }

  ngOnInit() {
    this.tempEvent = new Event([], []);
    this.tempEvent.budget = 0;
    this.searchSuppliers('Catering');
    this.searchSuppliers('Entertain');
    this.searchSuppliers('Decor');
  }

  onSelect(location: Location): void {
    this.selectedLocation = location;
  }

  valid(): boolean {
      let dateValid = false;
      if (this.startD.valid && this.startT.valid && this.endD.valid && this.endT.valid) {
          dateValid = new Date(this.SD.toString() + ' ' + this.ST.toString()) <
              new Date(this.ED.toString() + ' ' + this.ET.toString());
          if (!dateValid) {
              alert('Start time must be earlier than end time!');
              this.ED = null;
              this.ET = null;
          }
      }
      return this.b.valid && this.startD.valid && this.startT.valid && this.endD.valid && this.endT.valid && dateValid;
  }

  getErrorMessage(field: string) {
    if (field === 'b') {
      return this.b.hasError('required') ? 'You must enter a value' :
          this.b.hasError('min') ? 'Budget must be >= 0' :
              this.b.hasError('max') ? 'Budget must be <= 10^7' :
                  this.b.hasError('pattern') ? 'Budget must be an int' : '';
    }
    if (field === 'startD') {
      return this.startD.hasError('required') ? 'You must enter a value' : '';
    }
    if (field === 'startT') {
      return this.startT.hasError('required') ? 'You must enter a value' : '';
    }
    if (field === 'endD') {
      return this.endD.hasError('required') ? 'You must enter a value' : '';
    }
    if (field === 'endT') {
      return this.endT.hasError('required') ? 'You must enter a value' : '';
    }
  }

  openDialog(): void {
    tempData.choose = [];
    tempData.budget = this.tempEvent.budget;
    const dialogRef = this.dialog.open(BookDialogComponent, {
      width: '500px',
      data: tempData,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The supplier dialog was closed');
      console.log(result);
      if (result) {
        this.bookEvents();
        // this.clearInput();
      }
      this.selectedLocation = null;
    });
  }

  clearInput() {
    this.tempEvent = new Event([], []);
    this.tempEvent.budget = 0;
    this.SD = null;
    this.ST = null;
    this.ED = null;
    this.ET = null;
    this.tempSDate = null;
    this.tempEDate = null;
  }


  searchSuppliers(type: string): void {
    const table = type.toLowerCase();
    const requestBody = {
      'from': ['supplier', `${table}`],
      'where': {
        'supplier.SupplierID': `=${table}.SupplierID`,
      },
      'distinct': true,
    };
    console.log(requestBody);
    this.dbservice.searchSuppliers(requestBody).subscribe(
        suppliers => {
          suppliers.forEach(s => this.getSuppliersDetails(s));
          if (type === 'Entertain') {
            tempData.entertain = suppliers;
          } else if (type === 'Catering') {
            tempData.catering = suppliers;
          } else {
            tempData.decor = suppliers;
          }
        }
    );
  }

  getSuppliersDetails(supplier: Supplier): void {
    const supplierID: string = supplier.supplierID;
    const table: string = supplier.supplierType.toLowerCase();
    const wherePart = {};
    wherePart[`${table}.SupplierID`] = `=\'${supplierID}\'`;
    const requestBody = {
      'select': [`${table}.${supplier.supplierType}Name`, `${table}.${supplier.supplierType}Type`],
      'from': [`${table}`],
      'where': wherePart,
      'distinct': true
    };
    this.dbservice.searchMulti(requestBody).subscribe(
        info => {
          console.log(info);
          supplier.supplierDetail.name = info[0][0];
          supplier.supplierDetail.type = info[0][1];
        }
    );
  }

  searchLocations() {
    this.tempSDate = this.SD.toString() + ' ' + this.ST.toString();
    this.tempEDate = this.ED.toString() + ' ' + this.ET.toString();
    const wherePart = {};
    wherePart['LocationID'] = ` not in (SELECT LocationID FROM event WHERE
     (event.StartDate < \'${this.tempSDate}\' AND event.EndDate > \'${this.tempSDate}\')
      OR (event.StartDate < \'${this.tempEDate}\' AND \'${this.tempEDate}\' < event.EndDate))`;
    const requestBody = {
      'where': wherePart,
      'distinct': true
    };
    console.log(requestBody);
    this.dbservice.searchLocations(requestBody).subscribe(
        locations => {
          console.log(locations);
          this.locations = locations;
        }
    );
  }

  bookEvents() {
    const intoPart = ['ClientID', 'LocationID', 'Budget', 'StartDate', 'EndDate', 'EventType', 'Organizer'];
    const valuesPart = [`\'${userid}\'`, `\'${this.selectedLocation.locationID}\'`,
      `${this.tempEvent.budget}`, `\'${this.tempSDate}\'`, `\'${this.tempEDate}\'`,
      `\'${this.tempEvent.eventType}\'`, `\'${this.tempEvent.organizer}\'`];
    const requestBody = {
      'into': intoPart,
      'values': valuesPart
    };
    this.dbservice.findNextEventID().subscribe(
        nextID => {
          this.dbservice.insertEvent(requestBody).subscribe(
              data => {
                if (tempData.choose.length === 0) {
                  // @ts-ignore
                  if (confirm('Book done!')) {
                      location.reload();
                  }
                }
                tempData.choose.forEach(i => {
                  const id = i.supplierID;
                  const amt = i.amount;
                  const requestBody1 = {
                    'into': ['EventID', 'SupplierID', 'Amount'],
                    'values': [`\'${nextID}\'`, `\'${id}\'`, `${amt}`]
                  };
                  console.log(requestBody1);
                  this.dbservice.insertSupply(requestBody1).subscribe(
                      data1 => {
                        // @ts-ignore
                        if (confirm('Book done!')) {
                            location.reload();
                        }
                      },
                      err => {
                        throw err;
                      }
                  );
                });
                this.locations = [];
              },
              err => {
                throw err;
              }
          );
        },
            err => {
          // @ts-ignore
              if (confirm('Booking failed with error message ' + err)) {
                  location.reload();
              }
        }
    );

  }

}

@Component({
  selector: 'app-book-dialog',
  templateUrl: './bookdialog.component.html',
  styleUrls: ['./bookdialog.component.css']
})

export class BookDialogComponent implements OnInit {
  supplierControl = new FormControl();
  supplierForm: FormGroup;
  price = 0;
  v = true;

  constructor(
      public dialogRef: MatDialogRef<BookDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: DataInterface,
      private fb: FormBuilder) {
  }

  ngOnInit() {
    /* Initiate the form structure */
    this.supplierForm = this.fb.group({
      items: this.fb.array([this.fb.group({item: new Supplier([], []), amount: ''})])
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  get items() {
    return this.supplierForm.get('items') as FormArray;
  }

  addItems() {
    this.items.push(this.fb.group({item: new Supplier([], []), amount: ''}));
  }

  deleteItems(index) {
    this.items.removeAt(index);
  }

  valid(): boolean {
    return this.v;
  }

  updatePrice() {
    tempData.choose = [];
    let current = true;
    let currentPrice = 0;
    for (let i = 0; i < this.items.length; i += 1) {
      if (this.items.at(i).get('item').value.price && this.items.at(i).get('amount').value) {
        const a = this.items.at(i).get('amount').value;
        if (a !== parseInt(a, 10)) {
          console.log(a);
          console.log(parseInt(a, 10));
          alert('Given amount must be integer!');
          current = false;
        } else {
          currentPrice += this.items.at(i).get('item').value.price * Number(this.items.at(i).get('amount').value);
          tempData.choose.push({
            supplierID: this.items.at(i).get('item').value.supplierID,
            amount: Number(this.items.at(i).get('amount').value)
          });
        }
      }
    }
    this.v = current;
    this.price = currentPrice;
  }

  exceed(): boolean {
    if (this.price === 0) {
      return false;
    }
    return this.price > this.data.budget;
  }
}


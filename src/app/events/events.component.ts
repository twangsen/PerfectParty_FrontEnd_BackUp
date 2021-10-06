import {Component, Inject, OnInit} from '@angular/core';
import { Observable, of, throwError} from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Event } from '../event';
import { DbService } from '../db.service';
import {userid} from '../login/login.component';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {Supplier} from '../supplier';
import {AdminSupplierDialogComponent} from '../adminsupplier/adminsupplier.component';
import {FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})

export class EventsComponent implements OnInit {
  events: Event[];
  selectedEvent: Event;
  uEvent: Event;
  userid = userid;

  /* search field */
  sBudgetCompare: string;
  sBudget: string;
  sStartDate: Date;
  sType: string;
  sName: string;
  sState: string;
  sCity: string;
  // sStreet: string;
  sZip: string;
  sCapacity: string;
  sCapacityCompare: string;

  constructor(private dbservice: DbService, public dialog: MatDialog) { }

  ngOnInit() {
    this.getEvents();
  }

  onSelect(event: Event): void {
    this.selectedEvent = event;
    this.uEvent = Object.assign({}, event);
  }

  clearInput() {
    this.sBudgetCompare = null;
    this.sBudget = null;
    this.sStartDate = null;
    this.sState = null;
    this.sCity = null;
    // this.sStreet = null;
    this.sZip = null;
    this.sName = null;
    this.sType = null;
    this.sCapacity = null;
    this.sCapacityCompare = null;
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(EventsDialogComponent, {
      width: '500px',
      data: this.uEvent
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The supplier dialog was closed');
      console.log(result);
      if (result) {
        this.updateEvent();
      } else {
        this.selectedEvent = null;
      }
      this.getEvents();
    });
  }


  getEvents(): void {
    const wherePart = {};
    if (userid !== 'admin') {
      wherePart['ClientID'] = `=\'${userid}\'`;
    }
    const requestBody = {
      'where': wherePart
    };
    this.dbservice.postEvents(requestBody).subscribe(
        events => {
          events.forEach(e => {
            this.getAddress(e);
            this.getSupplies(e);
          });
          this.events = events;
        }
    );
  }

  updateEvent() {
    if (JSON.stringify(this.selectedEvent) === JSON.stringify(this.uEvent)) {
      this.selectedEvent = null;
      return;
    }
    // console.log(this.uEvent);
    const setPart = {};
    setPart['Budget'] = `=\'${this.uEvent.budget}\'`;
    setPart['EventType'] = `=\'${this.uEvent.eventType}\'`;
    setPart['Organizer'] = `=\'${this.uEvent.organizer}\'`;
    const wherePart = {};
    wherePart['EventID'] = `=\'${this.uEvent.eventID}\'`;
    const requestBody = {
      'set': setPart,
      'where': wherePart
    };
    // const old = this.uEvent;
    console.log(requestBody);
    this.dbservice.updateEvent(requestBody).subscribe(
        data => {
          if (data.includes('correct')) {
            console.log(this.uEvent);
            Object.assign(this.selectedEvent, this.uEvent);
          }
          alert('Update Done');
          // console.log(data);
        }
    );
  }

  searchEvents(): void {
    const wherePart = {};
    if (this.sBudget) {
      wherePart['event.Budget'] = `${this.sBudgetCompare}${this.sBudget.toString()}`;
    }
    if (this.sStartDate) {
      wherePart['event.StartDate'] = `>\'${this.sStartDate.toString()} 00:00:00\'
       AND event.StartDate < \'${this.sStartDate.toString()} 23:59:59\'`;
    }
    if (this.sType) {
      wherePart['event.EventType'] = `=\'${this.sType}\'`;
    }
    if (this.sName) {
      wherePart['event.Organizer'] = `=\'${this.sName}\'`;
    }
    if (this.sState) {
      wherePart['location.State'] = `=\'${this.sState}\'`;
    }
    if (this.sCity) {
      wherePart['location.City'] = `=\'${this.sCity}\'`;
    }
    if (this.sCapacity) {
      wherePart['location.Capacity'] = `${this.sCapacityCompare}${this.sCapacity}`;
    }
    if (this.sZip) {
      wherePart['location.ZipCode'] = `=\'${this.sZip}\'`;
    }
    wherePart['event.LocationID'] = '=location.LocationID';
    if (userid !== 'admin') {
      wherePart['event.ClientID'] = `=\'${userid}\'`;
    }
    const requestBody = {
      'where': wherePart,
      'from': ['event', 'location']
    };
    console.log(requestBody);
    this.dbservice.searchEvents(requestBody).subscribe(
        events => {
          events.forEach(e => {
            this.getAddress(e);
            this.getSupplies(e);
          });
          this.events = events;
        }
    );
  }

  deleteEvent(index: number, eventID: string): void {
    if (! confirm('Are you sure to delete this event?')) {
      return;
    }
    const requestBody = {
      'where': {
        'EventID': `=\'${eventID}\'`
      }
    };
    console.log(requestBody);
    // first delete supplies
    this.dbservice.deleteSupply(requestBody).subscribe(
      data => {
        this.dbservice.deleteEvent(requestBody).subscribe(
            data1 => {
              this.events.splice(index, 1);
              alert('Event deleted');
            },
            err => {
              throw err;
            }
        );
      }, err => {
          alert('Deletion failed, please try again');
        }
    );
  }

  getAddress(event: Event): void {
    const locationID: string = event.locationID;
    const wherePart = {};
    wherePart['LocationID'] = `=\'${locationID}\'`;
    const requestBody = {
      'select': ['ApartmentNumber', 'StreetAddress', 'City', 'State', 'ZipCode', 'Capacity'],
      'where': wherePart,
    };
    console.log(requestBody);
    this.dbservice.searchLocations(requestBody).subscribe(
        locations => {
          console.log(locations);
          event.address = `${locations[0].apartmentNumber} ${locations[0].streetAddress},` +
              `${locations[0].city}, ${locations[0].state} ${locations[0].zipcode}`;
          event.capacity = `${locations[0].capacity}`;
        }
    );
  }

  getSupplies(event: Event): void {
    event.supplies = [];
    const eventID: string = event.eventID;
    const wherePart = {};
    wherePart['supply.EventID'] = `=\'${eventID}\'`;
    const requestBody = {
      'from': ['supply'],
      'where': wherePart,
    };
    this.dbservice.searchSupply(requestBody).subscribe(
        supplies => {
          supplies.forEach(s => {
            const requestBody1 = {
              'from': ['supplier'],
              'where': {
                'supplier.SupplierID': `=${s.supplierID}`
              }
            };
            this.dbservice.searchSuppliers(requestBody1).subscribe(
                suppliers => {
                  suppliers.forEach(ss => {
                    const table: string = ss.supplierType.toLowerCase();
                    const where = {};
                    where[`${table}.SupplierID`] = `=\'${ss.supplierID}\'`;
                    const requestBody2 = {
                      'select': [`${table}.${ss.supplierType}Name`, `${table}.${ss.supplierType}Type`],
                      'from': [`${table}`],
                      'where': where,
                      'distinct': true
                    };
                    this.dbservice.searchMulti(requestBody2).subscribe(
                        info => {
                          event.supplies.push({supplyName: info[0][0], supplyType: `${ss.supplierType}`, supplyAmount: s.amount});
                        },
                        err => {
                          throw err;
                        }
                    );
                  });
                },
                err => {
                  throw err;
                }
            );
          });
        }, err => {
          console.log(err);
        }
    );
  }
}

@Component({
  selector: 'app-events-dialog',
  templateUrl: './eventsdialog.component.html',
  styleUrls: ['./eventsdialog.component.css']
})

export class EventsDialogComponent {

  budget = new FormControl('',
      [Validators.required,
        Validators.min(0), Validators.max(10 ** 7),
        Validators.pattern(new RegExp('^[0-9]*$'))]);

  constructor(
      public dialogRef: MatDialogRef<EventsDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: Event) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  valid(): boolean {
    return this.budget.valid;
  }

  getErrorMessage() {
    return this.budget.hasError('required') ? 'You must enter a value' :
        this.budget.hasError('min') ? 'Budget must be >= 0' :
            this.budget.hasError('max') ? 'Budget must be <= 10^7' :
                this.budget.hasError('pattern') ? 'Budget must be an int' : '';
  }
}

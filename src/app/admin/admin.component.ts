import { Component, OnInit } from '@angular/core';
import { Event } from '../event';
import { Client } from '../client';
import {Location} from '../location';
import {Supplier} from '../supplier';
import {DbService} from '../db.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  events: Event[];
  clients: Client[];
  locations: Location[];
  suppliers: Supplier[];

  constructor(private dbservice: DbService) { }

  ngOnInit() {
  }

  show(givenEid) {
    var x = document.getElementById(givenEid);
    if (x.style.display === 'none') {
      x.style.display = 'block';
    } else {
      x.style.display = 'none';
    }
  }

  getEvents(): void {
    this.dbservice.getEvents().subscribe(
        events => {
          this.events = events;
          console.log(events);
        }
    );
  }
    // TODO: should change the columns width for each table ?
    //  will look into that later
  getClients(): void {
    this.dbservice.getClients().subscribe(
        clients => {
          this.clients = clients;
          console.log(clients);
        }
    );
  }

  getLocations(): void {
    this.dbservice.getLocations().subscribe(
        locations => {
          this.locations = locations;
          console.log(locations);
        }
    );
  }

  getSuppliers(): void {
    this.dbservice.getSupplier().subscribe(
        suppliers => {
          this.suppliers = suppliers;
          console.log(suppliers);
        }
    );
  }

}

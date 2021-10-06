import {Component, Inject, OnInit} from '@angular/core';
import {DbService} from '../db.service';
import {Client} from '../client';
import {Supplier} from '../supplier';
import {loggedIn, userid} from '../login/login.component';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-adminclient',
  templateUrl: './adminclient.component.html',
  styleUrls: ['./adminclient.component.css']
})
export class AdminclientComponent implements OnInit {

  clients: Client[];
  selectedClient: Client;

  id = new FormControl('', [Validators.required]);
  first = new FormControl('', [Validators.required]);

  /* search field */
  sID: string;
  sFirst: string;
  sLast: string;
  sEventCompare: string;
  sEvent: string;
  /* insert field */

  nextID: number;
  // iID: string;
  iFirst: string;
  iLast: string;

  tempClient: Client;

  constructor(private dbservice: DbService, public dialog: MatDialog) { }

  ngOnInit() {
    this.getClients();
    this.getNextID();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AdminclientDialogComponent, {
      width: '300px',
      data: this.tempClient
      // {clientID: this.updateId, clientFirstName: this.updateFName, clientLastName: this.updateLName}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result);
      // clear selected client
      if (result != null) {
        this.updateClient(result.clientFirstName, result.clientLastName, result.clientEmail);
      } else {
        this.selectedClient = null;
      }
    });
  }

  valid(): boolean {
    return this.first.valid;
  }

  getErrorMessage(field: string) {
    if (field === 'first') {
      return this.first.hasError('required') ? 'You must enter a value' :
          '';
    }
  }


  onSelect(client: Client): void {
    this.selectedClient = client;
    this.tempClient =  Object.assign({}, client);
  }

  getClients(): void {
    this.dbservice.getClients().subscribe(
        clients => {
          this.clients = clients;
          this.getBudgetAndEvents();
        }
    );
  }

  getNextID(): void {
    this.dbservice.findNextClientID().subscribe(
        res => this.nextID = res
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
    this.sFirst = null;
    this.sLast = null;
    this.sEventCompare = null;
    this.sEvent = null;
    // this.iID = null;
    this.iFirst = null;
    this.iLast = null;
  }

  insertClient(): void {
    const intoPart = ['ClientFirstName', 'ClientPassword'];
    const valuesPart = [ `\'${this.iFirst}\'`, `'admin'`];
    if (this.iLast) {
      intoPart.push('ClientLastName');
      valuesPart.push(`\'${this.iLast}\'`);
    }
    const requestBody = {
      'into': intoPart,
      'values': valuesPart
    };
    this.dbservice.insertClient(requestBody).subscribe(
        // if no throw, then we will set user valid
        data => {
          alert(data);
          this.getClients();
          this.getNextID();
        }
    );
  }

  searchClients(): void {
    const wherePart = {};
    if (this.sID) {
      wherePart['client.ClientID'] = `=\'${this.sID}\'`;
    }
    if (this.sFirst) {
      wherePart['client.ClientFirstName'] = `=\'${this.sFirst}\'`;
    }
    if (this.sLast) {
      wherePart['client.ClientLastName'] = `=\'${this.sLast}\'`;
    }
    wherePart['event.ClientID'] = '=client.ClientID';
    const requestBody = {
      'where': wherePart,
      'from': ['client', 'event'],
      'distinct': true
    };
    // =0 , <1,2,3,4,... <=1,2,3,4,...., >=0
    // TODO:: Currently does not work with above condition since Count(*) does not work with 0
    requestBody['select'] = ['client.ClientID', 'client.ClientFirstName', 'client.ClientLastName', 'Count(event.EventID)'];
    requestBody['group'] = ['client.ClientID'];
    if (this.sEvent) {
      requestBody['have'] = {'Count(*)': ` > ${this.sEvent.toString()}`};
    }
    // requestBody['join'] = 'LEFT OUTER JOIN';
    // requestBody['on'] = {'client.ClientID': '=event.ClientID'};

    console.log(requestBody);
    this.dbservice.searchClients(requestBody).subscribe(
        clients => {
          this.clients = clients;
          this.getBudgetAndEvents();
        }
    );
  }

  getBudgetAndEvents(): void {
    const wherePart = {};
    wherePart['event.ClientID'] = '=client.ClientID';
    const requestBody = {
      'select': ['event.ClientID', 'Sum(event.Budget)', 'Count(*)'],
      'from': ['event', 'client'],
      'where': wherePart,
      'distinct': true,
      'group': ['event.ClientID']
    };
    this.dbservice.searchMulti(requestBody).subscribe(
        info => {
          // console.log(info);
          const dict = {};
          info.forEach(i => {
            dict[i[0]] = [i[1], i[2]];
          });
          this.clients.forEach(c => {
            if (c.clientID in dict) {
              c.totalBudget = Number(dict[c.clientID][0]);
              c.numberEvents = Number(dict[c.clientID][1]);
            }
          });
        }
    );
  }

  updateClient(f: string, l: string, e: string) {
    if (f === this.selectedClient.clientFirstName && l === this.selectedClient.clientLastName
        && e === this.selectedClient.clientEmail) {
      this.selectedClient = null;
      return;
    }
    console.log(f);
    console.log(l);
    const setPart = {};
    setPart['ClientFirstName'] = `=\'${f}\'`;
    setPart['ClientLastName'] = `=\'${l}\'`;
    setPart['ClientEmail'] = `=\'${e}\'`;
    const wherePart = {};
    wherePart['ClientID'] = `=\'${this.tempClient.clientID}\'`;
    const requestBody = {
      'set': setPart,
      'where': wherePart
    };
    console.log(requestBody);
    this.dbservice.updateClient(requestBody).subscribe(
        data => {
          if (data.includes('correct')) {
             this.selectedClient.clientFirstName = f;
             this.selectedClient.clientLastName = l;
             this.selectedClient.clientEmail = e;
            }
          alert('Update Done');
          // console.log(data);
          this.selectedClient = null;
        }
    );
  }
}



@Component({
  selector: 'app-adminclient-dialog',
  templateUrl: './adminclientdialog.component.html',
  styleUrls: ['./adminclientdialog.component.css']
})
export class AdminclientDialogComponent {

  first = new FormControl('', [Validators.required]);
  email = new FormControl('', [Validators.required, Validators.email]);

  constructor(
      public dialogRef: MatDialogRef<AdminclientDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: Client) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  valid(): boolean {
    return this.first.valid && this.email.valid;
  }

  getErrorMessage(field: string) {
    if (field === 'first') {
      return this.first.hasError('required') ? 'You must enter a value' : '';
    }
    if (field === 'email') {
      return this.email.hasError('required') ? 'You must enter a value' :
          this.email.hasError('email') ? 'Not a valid email' :
              '';
    }
  }

}

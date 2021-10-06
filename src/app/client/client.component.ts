import {Component, Input, OnInit} from '@angular/core';
import { Client } from '../client';
import {LoginComponent} from '../login/login.component';
import {DbService} from '../db.service';
import {userid} from '../login/login.component';
import {FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})

export class ClientComponent implements OnInit {

  client: Client = new Client([], ['', '', '']);

  // Field
  first = new FormControl('', [Validators.required]);
  password = new FormControl('', [Validators.required]);
  email = new FormControl('', [Validators.required, Validators.email]);

  constructor(private dbservice: DbService) {
    if (userid !== 'admin') {
      // this.client.id = userid;
      this.getClient(userid);
    }
  }

  ngOnInit() {
  }

  valid(field: string): boolean {
    if (field === 'first') {
      return this.first.valid;
    }
    if (field === 'password') {
      return this.password.valid;
    }
    if (field === 'email') {
      return this.email.valid;
    }
  }

  getErrorMessage(field: string) {
    if (field === 'first') {
      return this.first.hasError('required') ? 'You must enter a value' : '';
    }
    if (field === 'password') {
      return this.password.hasError('required') ? 'You must enter a value' : '';
    }
    if (field === 'email') {
      return this.email.hasError('required') ? 'You must enter a value' :
          this.email.hasError('email') ? 'Not a valid email' :
              '';
    }
  }

  showUpdate(givenEid) {
    const x = document.getElementById(givenEid);
    console.log(givenEid);
    if (x.style.display === 'none') {
      x.style.display = 'block';
    } else {
      x.style.display = 'none';
    }
  }

  update(givenEid, value) {
    if (givenEid === 'updateFirstName') {
      this.updateClient('ClientFirstName' , value);
    } else if (givenEid === 'updateLastName') {
      this.updateClient('ClientLastName', value);
    } else if (givenEid === 'updateEmail') {
      this.updateClient('ClientEmail', value);
    } else if (givenEid === 'updatePassword') {
      this.updateClient('ClientPassword', value);
    }
    const x = document.getElementById(givenEid);
    if (x.style.display === 'none') {
      x.style.display = 'block';
    } else {
      x.style.display = 'none';
    }
  }

  getClient(userId) {
    this.dbservice.getClient(userId).subscribe(
        data => {
          this.client = data;
          console.log(data);
        }
    );
  }

  updateClient(fieldName: string, value: string) {
    const setPart = {};
    setPart[fieldName] = `=\'${value}\'`;
    const wherePart = {};
    wherePart['ClientID'] = `=\'${userid}\'`;
    const requestBody = {
      'set': setPart,
      'where': wherePart
    };
    this.dbservice.updateClient(requestBody).subscribe(
        data => {
          if (data.includes('correct')) {
            if (fieldName === 'ClientFirstName') {
              this.client.clientFirstName = value;
            } else if (fieldName === 'ClientLastName') {
              this.client.clientLastName = value;
            } else if (fieldName === 'ClientEmail') {
              this.client.clientEmail = value;
            } else if (fieldName === 'ClientPassword') {
              this.client.clientPassword = value;
            }
            alert('Update Done');
          }
          console.log(data);
        }
    );
  }
}

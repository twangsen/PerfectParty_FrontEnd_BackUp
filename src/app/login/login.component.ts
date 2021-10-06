import {Component, Inject, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormControl, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {DbService} from '../db.service';
import {Client} from '../client';


export let loggedIn = false;
export let userid;

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

    userid: string;
    password: string;
    valid = false;
    nextID: number;

    /* signup field */
    tempClient: Client = new Client([], []);
    tempUserID: number;


    constructor(private router: Router, private dbservice: DbService, public dialog: MatDialog) {
    }


    ngOnInit() {
        this.userid = null;
        this.password = null;
        this.setID();
    }

    openDialog(): void {
        const dialogRef = this.dialog.open(LoginDialogComponent, {
            width: '300px',
            data: this.tempClient
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.registerClient();
            } else {
                console.log('close');
            }
            this.tempClient = new Client([], []);
            console.log('The dialog was closed');
            console.log(result);
        });
    }

    validUser(userId): void {
        this.dbservice.getClient(userId).subscribe(
            // if no throw, then we will set user valid
            data => {
                console.log(typeof (data));
                console.log(data);
                this.valid = true;
            }
        );
    }

    setID(): void {
        this.dbservice.findNextClientID().subscribe(
            res => {
                this.tempClient.clientID = res.toString();
                this.tempUserID = res;
            }
        );
    }

    registerClient(): void {
        const intoPart = ['ClientFirstName', 'ClientPassword'];
        const valuesPart = [`\'${this.tempClient.clientFirstName}\'`,
            `\'${this.tempClient.clientPassword}\'`];
        if (this.tempClient.clientLastName) {
            intoPart.push('ClientLastName');
            valuesPart.push(`\'${this.tempClient.clientLastName}\'`);
        }
        if (this.tempClient.clientEmail) {
            intoPart.push('ClientEmail');
            valuesPart.push(`\'${this.tempClient.clientEmail}\'`);
        }
        const requestBody = {
            'into': intoPart,
            'values': valuesPart
        };
        this.dbservice.insertClient(requestBody).subscribe(
            data => {
                alert('User registered correctly, now you can log in \n' +
                'Your User ID is ' + this.tempUserID
                );

            },
            error => {
                alert('Sign up failed with error: ' + error);
            }
        );
    }

    login(): void {
        if (this.userid === 'admin' && this.password === 'admin') {
            this.router.navigate(['admin']);
            userid = this.userid;
            loggedIn = true;
        } else {
            this.dbservice.getClient(this.userid).subscribe(
                // if no throw, then we will set user valid
                data => {
                    if (data.clientPassword === this.password) {
                        this.router.navigate(['home']);
                        userid = this.userid;
                        loggedIn = true;
                    } else {
                        alert('Incorrect password');
                    }
                },
                err => {
                    alert('No such user exists, please register first');
                }
            );
        }
    }

}

@Component({
    selector: 'app-login-dialog',
    templateUrl: './logindialog.component.html',
    styleUrls: ['./logindialog.component.css']
})
export class LoginDialogComponent {

    first = new FormControl('', [Validators.required]);
    password = new FormControl('', [Validators.required]);
    email = new FormControl('', [Validators.required, Validators.email]);

    constructor(
        public dialogRef: MatDialogRef<LoginDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: Client) {}

    onNoClick(): void {
        this.dialogRef.close();
    }

    valid(): boolean {
        return this.first.valid && this.password.valid && this.email.valid;
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

}

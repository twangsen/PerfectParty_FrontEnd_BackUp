import {Component, Inject, OnInit} from '@angular/core';
import {Event} from '../event';
import {DbService} from '../db.service';
import {userid} from '../login/login.component';
import {Supplier} from '../supplier';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {FormControl, Validators} from '@angular/forms';


@Component({
    selector: 'app-adminsupplier',
    templateUrl: './adminsupplier.component.html',
    styleUrls: ['./adminsupplier.component.css']
})
export class AdminsupplierComponent implements OnInit {

    suppliers: Supplier[];
    selectedSupplier: Supplier;

    type = new FormControl('', [Validators.required]);
    price = new FormControl('',
        [Validators.required,
            Validators.min(0),
            Validators.pattern(new RegExp('^[0-9]*$'))]);

    /* search field */
    sID: string;
    sName: string;
    sType: string;
    sdType: string;
    sPrice: string;
    sPriceCompare: string;

    /* insert field */
    nextID: number;
    // iID: string;
    iName: string;
    iType: string;
    idType: string;
    iPrice: string;

    /* update field */
     uSupplier: Supplier;

    constructor(private dbservice: DbService, public dialog: MatDialog) {
    }

    ngOnInit() {
        this.getSuppliers();
        this.getNextID();
    }

    onSelect(supplier: Supplier): void {
        this.selectedSupplier = supplier;
        this.uSupplier = Object.assign({}, supplier);
    }

    openDialog(): void {
        const dialogRef = this.dialog.open(AdminSupplierDialogComponent, {
            width: '500px',
            data: this.uSupplier
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The supplier dialog was closed');
            console.log(result);
            if (result) {
                this.updateSupplier();
            }
            this.selectedSupplier = null;
            this.getSuppliers();
        });
    }

    valid(): boolean {
        return this.type.valid && this.price.valid;
    }

    getErrorMessage(field: string) {
        if (field === 'type') {
            return this.type.hasError('required') ? 'You must enter a value' :
                '';
        }
        if (field === 'price') {
            return this.price.hasError('required') ? 'You must enter a value' :
                this.price.hasError('min') ? 'Price must be >= 0' :
                    this.price.hasError('pattern') ? 'Price must be an int' : '';
        }
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
        this.sName = null;
        this.sType = null;
        this.sdType = null;
        this.sPrice = null;
        this.sPriceCompare = null;
        // this.iID = null;
        this.iName = null;
        this.iType = null;
        this.idType = null;
        this.iPrice = null;
    }

    getSuppliers(): void {
        this.dbservice.getSupplier().subscribe(
            suppliers => {
                suppliers.forEach(s => this.getSuppliesAndEvents(s));
                suppliers.forEach(s => this.getSuppliersDetails(s));
                this.suppliers = suppliers;
            }
        );
    }

    getNextID(): void {
        this.dbservice.findNextSupplierID().subscribe(
            res => this.nextID = res
        );
    }

    insertSupplier(): void {
        const field = this.iType;
        const table = field.toLowerCase();
        let intoPart = ['SupplierType'];
        // required field
        const name = this.iName;
        // const id = this.iID;
        let valuesPart = [ `\'${this.iType}\'`];
        if (this.iPrice) {
            intoPart.push('Price');
            valuesPart.push(`${this.iPrice}`);
        }
        let requestBody = {
            'into': intoPart,
            'values': valuesPart
        };
        this.dbservice.insertSupplier(requestBody).subscribe(
            // if no throw, then we will set user valid
            data => {
                intoPart = ['SupplierID', `${field}Name`];
                valuesPart = [`${this.nextID}`, `\'${name}\'`];
                if (this.idType) {
                    intoPart.push(`${this.iType}Type`);
                    valuesPart.push(`\'${this.idType}\'`);
                }
                requestBody = {
                    'into': intoPart,
                    'values': valuesPart
                };
                this.dbservice.insertSupplier(requestBody, table + '/').subscribe(
                    data1 => {
                        alert(data);
                        this.getSuppliers();
                        this.getNextID();
                    }, err => {
                        alert('Update failed with error ' + err);
                    }
                );
            }, err => {
                alert('Update failed with error ' + err);
            }
        );
    }

    searchSuppliers(): void {
        if (this.sType === null) {
            alert('Please select a type first!');
            return;
        }
        const table = this.sType.toLowerCase();
        const wherePart = {};
        wherePart[`${table}.SupplierID`] = `=supplier.SupplierID`;
        if (this.sName) {
            wherePart[`${table}.${this.sType}Name`] = `=\'${this.sName}\'`;
        }
        if (this.sID) {
            wherePart[`supplier.SupplierID`] = `=\'${this.sID}\'`;
        }
        if (this.sPriceCompare && this.sPrice != null) {
            wherePart['supplier.Price'] = `${this.sPriceCompare}${this.sPrice.toString()}`;
        }
        const requestBody = {
            'from': ['supplier', `${table}`],
            'where': wherePart
        };
        console.log(requestBody);
        this.dbservice.searchSuppliers(requestBody).subscribe(
            suppliers => {
                suppliers.forEach(s => this.getSuppliesAndEvents(s));
                suppliers.forEach(s => this.getSuppliersDetails(s));
                this.suppliers = suppliers;
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

    getSuppliesAndEvents(supplier: Supplier): void {
        supplier.events = [];
        const supplierID: string = supplier.supplierID;
        const wherePart = {};
        wherePart['supply.SupplierID'] = `=\'${supplierID}\'`;
        wherePart['supply.EventID'] = '=event.EventID';
        const requestBody = {
            'select': ['event.EventID', 'event.Budget'],
            'from': ['event', 'supplier', 'supply'],
            'where': wherePart,
            'distinct': true
        };
        console.log(requestBody);
        this.dbservice.searchMulti(requestBody).subscribe(
            info => {
                console.log(info);
                info.forEach(i => supplier.events.push({eventID: i[0], budget: Number(i[1])}));
            }
        );
    }


    updateSupplier() {
        if (this.uSupplier.supplierDetail.name === this.selectedSupplier.supplierDetail.name
            && this.uSupplier.supplierDetail.type === this.selectedSupplier.supplierType) {
            this.selectedSupplier = null;
            return;
        }
        if (this.uSupplier.supplierDetail.name !== this.selectedSupplier.supplierDetail.name) {
            const field = this.selectedSupplier.supplierType;
            const table = field.toLowerCase();
            // Update corresponding table
            let setPart = {};
            setPart[`${table}.${field}Name`] = `=\'${this.uSupplier.supplierDetail.name}\'`;
            let wherePart = {};
            wherePart['SupplierID'] = `=\'${this.selectedSupplier.supplierID}\'`;
            let requestBody = {
                'set': setPart,
                'where': wherePart
            };
            console.log(requestBody);
            this.dbservice.updateSupplier(requestBody, table + '/').subscribe(
                data => {
                    console.log(data);
                    this.selectedSupplier.supplierDetail.name = this.uSupplier.supplierDetail.name;
                    if (this.uSupplier.price && Number(this.uSupplier.price) !== this.selectedSupplier.price) {
                        setPart = {};
                        setPart['Price'] = `=\'${this.uSupplier.price}\'`;
                        wherePart = {};
                        wherePart['SupplierID'] = `=\'${this.selectedSupplier.supplierID}\'`;
                        requestBody = {
                            'set': setPart,
                            'where': wherePart
                        };
                        console.log(requestBody);
                        this.dbservice.updateSupplier(requestBody).subscribe(
                            data1 => {
                                this.selectedSupplier.price = Number(this.uSupplier.price);
                                alert('Supplier Update Done');
                            },
                            err => {
                                alert('Update failed with error ' + err);
                            }
                        );
                    } else {
                        alert('Supplier Update Done');
                    }
                },
                err => {
                    alert('Update failed with error ' + err);
                }
            );
        } else if (this.uSupplier.price && Number(this.uSupplier.price) !== this.selectedSupplier.price) {
            const setPart = {};
            setPart['Price'] = `=\'${this.uSupplier.price}\'`;
            const wherePart = {};
            wherePart['SupplierID'] = `=\'${this.selectedSupplier.supplierID}\'`;
            const requestBody = {
                'set': setPart,
                'where': wherePart
            };
            console.log(requestBody);
            this.dbservice.updateSupplier(requestBody).subscribe(
                data => {
                    this.selectedSupplier.price = Number(this.uSupplier.price);
                    alert('Supplier Update Done');
                },
                err => {
                    alert('Update failed with error ' + err);
                }
            );
        }

    }

}


@Component({
    selector: 'app-adminsupplier-dialog',
    templateUrl: './adminsupplierdialog.component.html',
    styleUrls: ['./adminsupplierdialog.component.css']
})

export class AdminSupplierDialogComponent {

    price = new FormControl('',
        [Validators.required,
            Validators.min(0),
            Validators.pattern(new RegExp('^[0-9]*$'))]);

    constructor(
        public dialogRef: MatDialogRef<AdminSupplierDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: Supplier) {
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    valid(): boolean {
        return this.price.valid;
    }

    getErrorMessage(field: string) {
        if (field === 'price') {
            return this.price.hasError('required') ? 'You must enter a value' :
                this.price.hasError('min') ? 'Price must be >= 0' :
                    this.price.hasError('pattern') ? 'Price must be an int' : '';
        }
    }
}

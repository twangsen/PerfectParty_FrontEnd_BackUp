export class Supply {
    supplierID: string;
    eventID: string;
    amount: number;

    constructor(private field: Array<string>, private info: Array<string>) {
        if (field.length === 0) {
            this.supplierID = info[0];
            this.eventID = info[1];
            this.amount = parseFloat(info[2]);
        } else {
            info = info[0].toString().replace(/\(|\)|"/g, '')
                .split(',').map(String);
            field = field.map(f => f.replace('supplier\.', ''));
            if (field.indexOf('SupplierID') !== -1) {
                this.supplierID = info[field.indexOf('SupplierID')];
            }
            if (field.indexOf('EventID') !== -1) {
                this.eventID = info[field.indexOf('EventID')];
            }
            if (field.indexOf('Amount') !== -1) {
                this.amount = parseFloat(info[field.indexOf('Amount')]);
            }
        }
    }
}

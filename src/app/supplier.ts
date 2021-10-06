export class Supplier {
    supplierID: string;
    price: number;
    supplierType: string;
    events: Array<{
        eventID: string;
        budget: number;
    }>;
    supplierDetail: {
        name: string;
        type: string;
    };

    constructor(private field: Array<string>, private info: Array<string>) {
        if (field.length === 0) {
            this.supplierID = info[0];
            this.price = parseFloat(info[1]);
            this.supplierType = info[2];
            this.events = [];
        } else {
            info = info[0].toString().replace(/\(|\)|"/g, '')
                .split(',').map(String);
            field = field.map(f => f.replace('supplier\.', ''));
            if (field.indexOf('SupplierID') !== -1) {
                this.supplierID = info[field.indexOf('SupplierID')];
            }
            if (field.indexOf('Price') !== -1) {
                this.price = Number(info[field.indexOf('Price')]);
            }
            if (field.indexOf('SupplierType') !== -1) {
                this.supplierType = info[field.indexOf('SupplierType')];
            }
            this.events = [];
        }
        this.supplierDetail = {
            name: '',
            type: ''
        };
    }
}

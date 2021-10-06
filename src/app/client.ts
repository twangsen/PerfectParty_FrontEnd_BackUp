export class Client {
    clientID: string;
    clientFirstName: string;
    clientLastName: string;
    clientPassword: string;
    clientEmail: string;
    totalBudget: number;
    numberEvents: number;

    constructor(private field: Array<string>, private info: Array<string>) {
        if (field.length === 0) {
            this.clientID = info[0];
            this.clientFirstName = info[1];
            this.clientLastName = info[2];
            this.clientPassword = info[3];
            this.clientEmail = info[4];
            this.totalBudget = 0;
            this.numberEvents = 0;
        } else {
            info = info[0].toString().replace(/\(|\)"/g, '')
                .split(',').map(String);
            field = field.map(f => f.replace('client\.', ''));
            if (field.indexOf('ClientID') !== -1) {
                this.clientID = info[field.indexOf('ClientID')];
            }
            if (field.indexOf('ClientFirstName') !== -1) {
                this.clientFirstName = info[field.indexOf('ClientFirstName')];
            }
            if (field.indexOf('ClientLastName') !== -1) {
                this.clientLastName = info[field.indexOf('ClientLastName')];
            }
            if (field.indexOf('ClientPassword') !== -1) {
                this.clientPassword = info[field.indexOf('ClientPassword')];
            }
            if (field.indexOf('ClientLastEmail') !== -1) {
                this.clientEmail = info[field.indexOf('ClientLastEmail')];
            }
            this.totalBudget = 0;
            this.numberEvents = 0;
        }
    }
}


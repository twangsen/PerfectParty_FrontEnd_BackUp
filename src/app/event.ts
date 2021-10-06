export class Event {
  eventID: string;
  clientID: string;
  locationID: string;
  budget: number;
  startDate: Date;
  endDate: Date;
  eventType: string;
  organizer: string;
  address: string;
  capacity: string;
  supplies: Array<{
    supplyName: string;
    supplyType: string;
    supplyAmount: number;
  }>;

  constructor(private field: Array<string>, private info: Array<string>) {
    if (field.length === 0) {
      this.eventID = info[0];
      this.clientID = info[1];
      this.locationID = info[2];
      this.budget = parseFloat(info[3]);
      this.startDate = new Date(info[4]);
      this.endDate = new Date(info[5]);
      this.eventType = info[6];
      this.organizer = info[7];
      this.address = '';
      this.capacity = '';
    }
    this.supplies = [];
    // TODO:: Like Location add field support
  }
}

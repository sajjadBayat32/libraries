import {Time} from "./Time";

export class Field {
  id: string;
  name: string;
  times: Time[];
  complexID: string;

  constructor(item: any) {
    this.id = item.id;
    this.name = item.name;
    this.times = item.times;
    this.complexID = item.complexID;
  }
}

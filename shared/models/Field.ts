import {Time} from "./Time";

export class Field {
  name: string;
  times: Time[];
  complexID: string;
  id: string;

  constructor() {
    this.name = '';
    this.times = [];
    this.complexID = '';
    this.id = '';
  }

  getTimeId(numOfDay: number, timeFrom: number) {
    let time = this.times.find((time) => time.numOfDay === numOfDay && time.timeFrom === timeFrom)
    if (time)
      return time.id
    return -1;
  }
}

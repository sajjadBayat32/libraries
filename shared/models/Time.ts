import {Reserve} from "./Reserve";

export interface Time {
  id: string;
  numOfDay: number;
  price: number;
  timeFrom: number;
  timeTo: number;
  date?: string;
  reservation?: Reserve;
}

import {Injectable} from "@angular/core";

@Injectable()
export class CommonFunctions {
  groupJsonList<T>(list: T[], key: string) {
    return list.reduce(function(rv: any, x: any) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  };
}

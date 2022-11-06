import {Pipe, PipeTransform} from "@angular/core";
import * as moment from "jalali-moment";

@Pipe({
  name: 'jalali'
})
export class JalaliPipe implements PipeTransform {
  transform(value: any, get?: 'month' | 'monthName' | 'day'): any {
    let MomentDate = moment(value).locale('fa');
    let result = '';
    if (!get)
      return MomentDate.format('YYYY/MM/DD');
    switch (get) {
      case 'day':
        result =  MomentDate.date().toString();
        break
      case 'monthName':
        result =  MomentDate.format('jMMMM');
        break
    }
    return result;
  }
}

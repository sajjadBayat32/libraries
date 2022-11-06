import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
  name: 'time'
})
export class TimePipe implements PipeTransform {
  transform(value: any, mode: 'shorten' | 'normal' = 'normal', get: 'full' | 'hour' | 'min' = 'full'): any {
    let minutes = (value % 60);
    let hours = (value - minutes) / 60;
    let hour = hours.toLocaleString('en-US', {
      minimumIntegerDigits: mode === 'shorten' ? 1 : 2
    });
    let minute = minutes.toLocaleString('en-US', {
      minimumIntegerDigits: mode === 'shorten' ? 1 : 2
    });
    switch (get) {
      case 'full':
        return hour + ':' + minute
      case 'hour':
        return hour
      case 'min':
        return minute
    }
  }
}

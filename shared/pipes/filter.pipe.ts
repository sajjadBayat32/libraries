import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform<T>(value: Array<T>, callback: any): Array<T> {
    return value.filter(callback);
  }
}

import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
  name: 'toman'
})
export class TomanPipe implements PipeTransform {
  transform(value: string): any {
    return value + `<span class="toman" nz-icon nzType="ng-zorro:toman"></span>`;
  }
}

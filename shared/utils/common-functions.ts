import {Injectable} from "@angular/core";
import {NzMessageService} from "ng-zorro-antd/message";

@Injectable()
export class CommonFunctions {

  constructor(private toaster: NzMessageService) {
  }

  groupJsonList<T>(list: T[], key: string) {
    return list.reduce(function (rv: any, x: any) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  };

  dateToTimeNumber(date: Date) {
    let h = date.getHours();
    let m = date.getMinutes();
    return (h * 60) + m;
  }

  copyToClipboard(value: string, tag?: string) {
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = tag ? (tag + ':' + value) : value;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.toaster.info('کپی شد');
  }
}

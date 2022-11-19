import {Injectable} from "@angular/core";
import {NzMessageService} from "ng-zorro-antd/message";

@Injectable()
export class CommonFunctions {

  constructor(private toaster: NzMessageService) {
  }

  groupJsonList<T>(list: T[], key: string) {
    return list.reduce(function(rv: any, x: any) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  };

  copyToClipboard(value: string) {
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = value;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.toaster.info('کپی شد');
  }
}

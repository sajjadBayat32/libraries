import {Injectable} from "@angular/core";
import {HttpErrorResponse} from "@angular/common/http";
import {NzMessageService} from "ng-zorro-antd/message";

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  constructor(private toaster: NzMessageService) {
  }

  handle(error: HttpErrorResponse) {
    if (error.status >= 500) {
      this.logServer(error)
    }
  }

  logServer(error: HttpErrorResponse) {
    let toastMsg = 'خطایی در سمت سرور اتفاق افتاده. لطفا با همکاران ما تماس حاصل کنید';
    this.toaster.error(
      toastMsg,
      {
        nzDuration: 10000
      }
    )
  }

  toast(message: string, type: 'error' | 'warning' = 'error') {
    this.toaster.create(
      type,
      message,
      {
        nzDuration: this.calculateToastDuration(message)
      }
    )
  }

  calculateToastDuration(msg: string) {
    return msg.length * 100;
  }
}

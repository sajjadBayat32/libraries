import {Injectable} from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from "@angular/common/http";
import {Observable, throwError, BehaviorSubject} from "rxjs";
import {catchError, filter, take, switchMap} from "rxjs/operators";
import {AuthService} from "../services/auth.service";
import {Dictionary} from "../../shared/models/Dictionary";
import * as moment from "jalali-moment";

@Injectable()
export class HttpInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );

  constructor(public authService: AuthService) {
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (this.authService.getJwtToken()) {
      request = HttpInterceptor.addToken(request, this.authService.getJwtToken());
    }
    request = this.modifyRequestUrl(request);
    if (request.body) {
      request = this.modifyRequestBody(request);
    }
    return next.handle(request).pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          return this.handle401Error(request, next);
        } else {
          return throwError(error);
        }
      })
    );
  }

  private static addToken(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  private modifyRequestBody(request: HttpRequest<any>) {
    let newRequest = this.updateRequestBody(request.body);
    return request.clone({
      body: {
        ...newRequest
      }
    })
  }

  private modifyRequestUrl(request: HttpRequest<any>) {
    let newRequestUrl = this.updateRequestParams(request.url);
    return request.clone({
      url: request.url.split('?')[0] + '?' + newRequestUrl
    })
  }

  updateRequestParams(url: string) {
    let urlParams = new URLSearchParams(url.split('?')[1]);
    urlParams.forEach((value, key) => {
      // TODO: handle numbers which are moment valid but not date time. recommended way is to check it by length
      if (moment(value).isValid()) {
        urlParams.set(key, moment(value).locale('en').format('YYYY-MM-DD'))
      }
    })
    return urlParams;
  }

  updateRequestBody(body: Dictionary<any>): Dictionary<any> {
    Object.keys(body).forEach((key) => {
      if (body[key] === null || body[key] === undefined) {
        delete body[key];
      }
      if (body[key] instanceof Date && moment(body[key]).isValid()) {
        body[key] = moment(body[key]).locale('en').format('YYYY-MM-DD');
      }
    })
    return body
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);
      return this.authService.refreshToken().pipe(
        switchMap((data: any) => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(data['data']['refresh'].token);
          return next.handle(HttpInterceptor.addToken(request, data['data']['access'].token));
        })
      );
    } else {
      return this.refreshTokenSubject.pipe(
        filter((token) => token != null),
        take(1),
        switchMap((jwt) => {
          return next.handle(HttpInterceptor.addToken(request, jwt));
        })
      );
    }
  }
}

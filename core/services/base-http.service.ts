import {Injectable, Injector} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {finalize, first, map, Observable, Subject, Subscription, tap, throwError} from "rxjs";
import {catchError} from "rxjs/operators";
import {ParamsHandler} from "./params-handler.class";
import {Dictionary} from "../../shared/models/Dictionary";
import {BaseHttpConfig, HttpVerb, Response} from "./http-request.type";
import {environment} from "../../../environments/environment";
import {NzMessageService} from "ng-zorro-antd/message";
import {getLocalStorage} from "../../shared/utils/local-storage";
import {ErrorHandlerService} from "@libraries/core/services/error-handler.service";

@Injectable({
  providedIn: 'root'
})
export class BaseHttp {
  private readonly defaultBaseHttpConfig: BaseHttpConfig;

  public pendingRequests: Array<{
    url: string;
    subscription: Subscription;
  }> = [];

  constructor(
    private injector: Injector
  ) {

    this.defaultBaseHttpConfig = {
      baseUrl: environment.baseUrl,
      hasLoading: false,
      ignoreNullParams: true,
      messageShow: true,
      ignoreAuthToken: false
    };
  }

  createRequest(
    verb: HttpVerb = "GET",
    requestUrl: string,
    options: Partial<BaseHttpConfig> = {}
  ): RequestBuilder {
    const requestConfig = {...this.defaultBaseHttpConfig, ...options};
    return new RequestBuilder(
      verb,
      requestUrl,
      requestConfig,
      this.injector
    );
  }
}

class RequestBuilder {
  private readonly requestUrl: string = null;
  private readonly urlParameters: ParamsHandler;
  private readonly bodyParameters: ParamsHandler;

  config: BaseHttpConfig;
  http: HttpClient;
  baseHttp: BaseHttp;
  toaster: NzMessageService;
  errorHandler: ErrorHandlerService;

  constructor(
    private verb: HttpVerb = "GET",
    private url: string,
    private baseHttpConfig: BaseHttpConfig,
    private injector: Injector,
  ) {
    this.requestUrl = url;
    this.config = baseHttpConfig;
    this.http = injector.get(HttpClient);
    this.baseHttp = injector.get(BaseHttp);
    this.toaster = injector.get(NzMessageService);
    this.errorHandler = injector.get(ErrorHandlerService);
    this.bodyParameters = new ParamsHandler();
    this.urlParameters = new ParamsHandler();
  }

  public addParam(key: any, value: any): RequestBuilder {
    this.urlParameters.addParam(key, value);
    return this;
  }

  public addParams(model: any): RequestBuilder {
    this.addParamsToVariable(model, this.urlParameters);
    return this;
  }

  public addBody(key: any, value: any): RequestBuilder {
    this.bodyParameters.addParam(key, value);
    return this;
  }

  public addBodies(model: any): RequestBuilder {
    this.addParamsToVariable(model, this.bodyParameters);
    return this;
  }

  public send<T = any>(): Observable<Response<T>> {
    let request$: Observable<any>;
    if (!window.navigator.onLine) {
      this.toaster.create(
        'warning',
        'لطفا از اتصال خود به شبکه اینترنت مطمئن شوید',
        {nzDuration: 10000}
      )
    }

    const hasParam =
      this.urlParameters !== undefined && this.urlParameters.count() > 0;
    const urlWithParams =
      this.getUrl() + (hasParam ? "?" + this.urlParameters.urlParameters() : "");

    let headers = new HttpHeaders({
      "Content-Type": "application/json",
    });

    if (!this.config.ignoreAuthToken)
      headers = headers.append("Authorization", `${RequestBuilder.token}`);

    switch (this.verb) {
      case "GET":
        request$ = this.http.get(urlWithParams, {headers: headers});
        break;
      case "POST":
        request$ = this.http.post(
          urlWithParams,
          this.toObject(this.bodyParameters.getParams()),
          {
            headers: headers,
          }
        );
        break;
      case "PUT":
        request$ = this.http.put(
          urlWithParams,
          this.toObject(this.bodyParameters.getParams()),
          {
            headers: headers,
          }
        );
        break;
      case "DELETE":
        request$ = this.http.delete(urlWithParams, {headers: headers});
        break;
    }

    let result: Subject<Response<T>> = new Subject<Response<T>>();
    const subscription = request$
      .pipe(
        /**this is a http call so finalize will call first after any response nor error */
        finalize(() => {
        }),
        map(RequestBuilder.handlePipeMap),
        catchError((error) => {
          result.error(error);
          return this.errorHandling(error);
        }),
        // tap((resp) => this.messageHandling<T>(this, resp))
      )
      .subscribe((resp) => {
        this.removeRequestFromPending(this.getUrl());
        result.next(resp);
      });

    this.baseHttp.pendingRequests.push({
      url: this.getUrl(),
      subscription: subscription,
    });
    return result.asObservable().pipe(first());
  }

  private getUrl(): string {
    let url: any = this.config.baseUrl;
    if (this.requestUrl) {
      return `${url}/${this.requestUrl}`;
    }
    return url;
  }

  private static handlePipeMap(resp: Response) {
    return resp;
  }

  private messageHandling<T>(parent: RequestBuilder, resp: Response<T>) {
    if (parent.config.messageShow && resp.message) {
      this.toaster.create(
        "success",
        resp.message
      );
    }
  }

  private errorHandling(error: HttpErrorResponse) {
    this.errorHandler.handle(error)
    return throwError(() => error);
  }

  private static get token(): string {
    return getLocalStorage('JWT_Token');
  }

  private addParamsToVariable(
    model: any,
    destinationVar: ParamsHandler
  ) {
    Object.keys(model).forEach((key) => {
      destinationVar.addParam(key, model[key]);
    });
  }

  private removeRequestFromPending(url: string) {
    let index = this.baseHttp.pendingRequests.findIndex(
      (el) => el.url == this.getUrl()
    );
    if (index > -1) {
      this.baseHttp.pendingRequests[index].subscription.unsubscribe();
      this.baseHttp.pendingRequests.splice(index, 1);
    }
  }

  private toObject(model: Dictionary<any>) {
    let temp: Dictionary<any> = {};
    Object.keys(model).forEach((key) => {
      temp[key] = model[key];
    });
    return temp;
  }
}

import {Injectable} from '@angular/core';
import {ActivationEnd, NavigationEnd, NavigationStart, Router} from '@angular/router';
import {BehaviorSubject} from 'rxjs';
import {Dictionary} from "@libraries/shared/models/Dictionary";

@Injectable({providedIn: 'root'})
export class StateService {
  public viewState: any = {};
  public lock: boolean = false;
  private _routerParams: string = "";
  private _getStateChange$: BehaviorSubject<any> | undefined;

  constructor(private router: Router) {
    this._init();
  }

  private _init() {
    let backTrigger = false;
    let refreshTrigger = true;
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this._routerParams = "";
      }
      if (event instanceof ActivationEnd) {
        if (event.snapshot.params['params']) {
          this._routerParams = event.snapshot.params['params'];
        }
        if (refreshTrigger) {
          refreshTrigger = false;
          this._getStateChange$ = new BehaviorSubject(this._routerParams ? this.decode(this._routerParams) : {});
        }
      }
      if (event['navigationTrigger'] === 'popstate') {
        backTrigger = true;
      }
      if (event instanceof NavigationEnd && backTrigger) {
        backTrigger = false;
        let params = this._routerParams
          ? this.decode(this._routerParams)
          : {};
        this._getStateChange$?.next(params);
      }
    });
  }

  private getRouteWithoutParam() {
    if (this._routerParams) {
      let routeSegment = this.router.url.split('/');
      let paramRouteSegment = routeSegment[routeSegment.length - 1];
      return this.router.url.replace(paramRouteSegment, '');
    } else {
      return this.router.url;
    }
  }

  public get getStateChange() {
    return this._getStateChange$?.asObservable();
  }

  public encode(object: any): string {
    return btoa(JSON.stringify(object));
  }

  public decode(url: string) {
    return JSON.parse(atob(url));
  }

  public refreshUrl() {
    this.router.navigate([
      this.getRouteWithoutParam(),
      this.encode(this.viewState)
    ]).then();
  }

  public updateViewState(params: Dictionary<any>) {
    if (params != null) {
      for (let p in params) {
        this.viewState[p] = params[p];
      }
    }
    this.refreshUrl();
  }

  public resetViewState(params: Dictionary<any>) {
    if (this.viewState != null) {
      for (let p in this.viewState) {
        delete this.viewState[p];
      }
    }
    if (params != null) {
      for (let p in params) {
        this.viewState[p] = params[p];
      }
    }
    this.refreshUrl();
  }

  public destroyState() {
    this.viewState = {};
    this._getStateChange$?.next({});
  }
}

import {Injectable} from '@angular/core';
import {ActivationEnd, NavigationEnd, Params, Router} from '@angular/router';
import {BehaviorSubject, distinctUntilChanged} from 'rxjs';
import {Dictionary} from "@libraries/shared/models/Dictionary";
import {FilterChip, FilterChips, FilterChipTypes} from "../../../app/shared/types/filter-chip.types";

@Injectable({providedIn: 'root'})
export class StateService {
  public lock: boolean = false;
  public viewState: any = {};
  public filterChips: BehaviorSubject<Dictionary<FilterChip>> = new BehaviorSubject({});
  private _getStateChange$: BehaviorSubject<any> = new BehaviorSubject<any>({});

  constructor(private router: Router) {
    this._init();
  }

  private _init() {
    let queryParams = {};
    this.router.events.subscribe((event) => {
      if (event instanceof ActivationEnd) {
        queryParams = event.snapshot.queryParams
      }
      if (event instanceof NavigationEnd) {
        this._getStateChange$.next(queryParams);
        this.setFilterChips(queryParams);
      }
    });
  }

  private getRouteWithoutParam() {
    return this.router.url.split('?')[0]
  }

  public get getStateChange() {
    return this._getStateChange$?.asObservable().pipe(distinctUntilChanged());
  }

  public encode(object: any): string {
    return btoa(JSON.stringify(object));
  }

  public updateViewState(params?: Params, routeTo?: string) {
    if (params) {
      for (let p in params) {
        this.viewState[p] = params[p];
      }
    }
    this.refreshUrl(routeTo);
  }

  public removeFromViewState(key: string) {
    if (this.viewState)
      delete this.viewState[key];
    this.updateViewState();
  }

  public resetViewState(params?: Params) {
    if (this.viewState) {
      for (let p in this.viewState) {
        delete this.viewState[p];
      }
    }
    this.updateViewState();
  }

  public refreshUrl(routeTo?: string) {
    this.router.navigate(
      [routeTo ? routeTo : this.getRouteWithoutParam()],
      {queryParams: this.viewState}
    ).then();
  }

  setFilterChips(state: Params) {
    let filterChips: Dictionary<FilterChip> = {};
    for (let f in FilterChips) {
      if (state.hasOwnProperty(f)) {
        filterChips[f] = {name: FilterChips[f as keyof typeof FilterChips].name, value: state[f]};
      }
    }
    this.filterChips.next(filterChips);
  }

  lockFilterChips() {
    this.lock = true;
  }

  unlockFilterChips() {
    this.lock = false;
  }

  public destroyState() {
    this.viewState = {};
    this._getStateChange$?.next({});
  }
}

import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from 'src/environments/environment';
import {User} from '../../shared/models/User';
import {Router} from "@angular/router";
import {Token} from "../../shared/models/Token";
import {of, tap} from "rxjs";
import {catchError} from "rxjs/operators";
import {BaseHttp} from "./base-http.service";
import {getLocalStorage, removeLocalStorage, setLocalStorage} from "../../shared/utils/local-storage";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedUser: User;

  constructor(
    private http: HttpClient,
    private router: Router,
    private baseHttp: BaseHttp
  ) {
  }

  login(model: { phone: string, password: string }) {
    return this.baseHttp.createRequest('POST', 'auth/login')
      .addBodies(model)
      .send<{ user: User, tokens: any }>()
  }

  changePassword(model: {currentPassword: string, newPassword: string}) {
    return this.baseHttp.createRequest('POST', 'auth/changePass')
      .addBodies(model)
      .send()
  }

  logout() {
    this.loggedUser = null;
    this.doLogoutUser();
  }

  isLoggedIn() {
    return !!this.getJwtToken();
  }

  refreshToken() {
    return this.baseHttp.createRequest('POST', 'auth/refresh-tokens')
      .addBody('refreshToken', this.getRefreshToken())
      .send()
      .pipe(
        tap(({data}) => {
          this.storeTokens(data);
        }),
        catchError(() => {
          this.doLogoutUser();
          return of(false);
        })
      )
  }

  getJwtToken() {
    return getLocalStorage('JWT_Token');
  }

  doLoginUser(user: User, tokens: { access: Token, refresh: Token }, redirectUrl: string) {
    this.loggedUser = user;
    this.storeTokens(tokens);
    this.router.navigate([redirectUrl]).then()
  }

  private doLogoutUser() {
    this.loggedUser = null;
    this.removeTokens();
    this.router.navigate(["/auth/login"]).then();
  }

  getRefreshToken() {
    return getLocalStorage('Refresh_Token');
  }

  storeTokens(tokens: { access: Token, refresh: Token }) {
    setLocalStorage('JWT_Token', tokens.access.token);
    setLocalStorage('Refresh_Token', tokens.refresh.token);
  }

  removeTokens() {
    removeLocalStorage('JWT_Token');
    removeLocalStorage('Refresh_Token');
  }
}

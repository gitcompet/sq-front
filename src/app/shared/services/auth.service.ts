import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { Login } from 'src/app/core/models/login.model';
import { TokenResponse } from 'src/app/core/models/token-response.model';
import { IUser, User } from 'src/app/core/models/user.model';
import { environment } from 'src/environments/environment.development';
import { JWTHelperService } from './jwt-helper.service';
import {
  formUrlEncodedHeaders,
  headers,
} from 'src/app/core/constants/settings';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private router: Router,
    private jwtService: JWTHelperService,
    private localStorageService: LocalStorageService
  ) {}

  isLoggedin: boolean = false;

  signUp(payload: User): Observable<IUser> {
    return this.http
      .post<User>(
        `${environment.baseUrl}${environment.apiVersion}${environment.userPaths.base}`,
        payload
      )
      .pipe(
        map((user) => {
          const modifiedUser = {} as IUser;
          modifiedUser.loginId = user.loginId;
          modifiedUser.email = user.email;
          modifiedUser.firstName = user.firstName;
          modifiedUser.lastName = user.lastName;
          modifiedUser.login = user.login;
          return modifiedUser;
        })
      );
  }
  login(payload: Login): Observable<TokenResponse> {
    return this.http.post<TokenResponse>(
      `${environment.baseUrl}${environment.apiVersion}${environment.authPaths.base}${environment.authPaths.login}`,
      payload
    );
  }
  refreshToken(payload: any): Observable<TokenResponse> {
    return this.http.post<TokenResponse>(
      `${environment.baseUrl}${environment.apiVersion}${environment.authPaths.base}${environment.authPaths.refresh}`,

      payload,
      { headers: headers }
    );
  }
  logout() {
    this.removeToken();
    this.isLoggedin = false;
    this.router.navigateByUrl('/');
  }
  hasTokenExpired(): boolean {
    const token = this.getToken();
    return (
      (token === undefined || token === null) &&
      this.jwtService.hasTokenExpired(token)
    );
  }
  isLoggedIn(): boolean {
    const token = this.getToken();
    if (token && this.jwtService.hasTokenExpired(token)) {
      return this.isLoggedin;
    }
    return true;
  }
  getToken(): string {
    return this.localStorageService.getData('token') as string;
  }
  getRefreshToken(): string {
    return this.localStorageService.getData('refresh') as string;
  }

  getId(): string {
    const decodedToken: any = this.jwtService.decode(this.getToken());
    const properties: string[] = Object.getOwnPropertyNames(decodedToken);
    const key: string = properties.filter((value) =>
      value.includes('identifier')
    )[0];
    const id = decodedToken[key] as string;
    return id;
  }
  setToken(response: TokenResponse) {
    this.localStorageService.saveData('token', response.accessToken);
    this.localStorageService.saveData('refresh', response.refreshToken);
  }
  removeToken() {
    this.localStorageService.clearData();
  }
  getRoles(): string[] {
    const decodedToken: any = this.jwtService.decode(this.getToken());
    const properties: string[] = Object.getOwnPropertyNames(decodedToken);
    const key: string = properties.filter((value) => value.includes('role'))[0];
    const roles = decodedToken[key] as string[];
    const activatedRoles: string[] = [];
    if (Array.isArray(roles)) return roles;
    activatedRoles.push(roles);
    return activatedRoles;
  }
  isAdmin() {
    return this.getRoles().includes('admin'.toUpperCase());
  }
  getUsername(): string {
    const decodedToken: any = this.jwtService.decode(this.getToken());
    const username = decodedToken['sub'] as string;
    return username;
  }
}

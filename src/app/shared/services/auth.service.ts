import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Login } from 'src/app/core/models/login.model';
import { TokenResponse } from 'src/app/core/models/token-response.model';
import { User } from 'src/app/core/models/user.model';
import { environment } from 'src/environments/environment.development';
import { JWTHelperService } from './jwt-helper.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private router: Router,
    private jwtService: JWTHelperService
  ) {}

  isLoggedin: boolean = false;

  signUp(payload: User): Observable<User> {
    return this.http.post<User>(
      `${environment.baseUrl}${environment.apiVersion}${environment.userPaths.base}`,
      payload
    );
  }
  login(payload: Login): Observable<TokenResponse> {
    return this.http.post<TokenResponse>(
      `${environment.baseUrl}${environment.apiVersion}${environment.authPaths.base}${environment.authPaths.login}`,
      payload
    );
  }
  refreshToken(refreshToken: string): Observable<TokenResponse> {
    return this.http.post<TokenResponse>(
      `${environment.baseUrl}${environment.apiVersion}${environment.authPaths.base}${environment.authPaths.refresh}`,
      refreshToken
    );
  }
  logout() {
    this.removeToken();
    this.isLoggedin = false;
    this.router.navigateByUrl('/');
  }
  isLoggedIn(): boolean {
    const token = this.getToken();
    if (token == null && this.jwtService.hasTokenExpired(token)) {
      //REFRESH TOKEN INSTEAD
      // this.refreshToken(this.getRefreshToken()).subscribe((response)=>{
      //    this.setToken(response);
      //    this.isLoggedin = true;
      // });
      return this.isLoggedin;
    }
    return true;
  }
  getToken(): string {
    return localStorage.getItem('token') as string;
  }
  getRefreshToken(): string {
    return localStorage.getItem('refresh') as string;
  }

  getId(): string {
    const decodedToken: any = this.jwtService.decode(this.getToken());
    const properties: string[] = Object.getOwnPropertyNames(decodedToken);
    const key: string = properties.filter((value)=> value.includes("identifier"))[0];
    const id = decodedToken[
      key
    ] as string;
    return id;
  }
  setToken(response: TokenResponse) {
    localStorage.setItem('token', response.accessToken);
    localStorage.setItem('refresh', response.refreshToken);
  }
  removeToken() {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh');
  }
  getRoles(): string [] {
    const decodedToken: any = this.jwtService.decode(this.getToken());
    const properties: string[] = Object.getOwnPropertyNames(decodedToken);
    const key: string = properties.filter((value)=> value.includes("role"))[0];
    const roles = decodedToken[
      key
    ] as string[];
    return roles;
  }
  isAdmin(){
    return this.getRoles()
            .includes("admin".toUpperCase())
  }
  getUsername(): string {
    const decodedToken: any = this.jwtService.decode(this.getToken());
    const username = decodedToken[
      'sub'
    ] as string;
    return username;
  }
}

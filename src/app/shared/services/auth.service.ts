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
      `${environment.baseUrl}${environment.basePath}${environment.registrationPath}`,
      payload
    );
  }
  login(payload: Login): Observable<TokenResponse> {
    return this.http.post<TokenResponse>(
      `${environment.baseUrl}${environment.basePath}${environment.authPath}`,
      payload
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
  setToken(response: TokenResponse) {
    localStorage.setItem('token', response.accessToken);
    localStorage.setItem('refresh', response.refreshToken);
  }
  removeToken() {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh');
  }
  isAdmin(): boolean {
    const decodedToken: any = this.jwtService.decode(this.getToken());
    const roles = decodedToken[
      'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
    ] as string[];
    if (
      roles.find((element) => element.toUpperCase() === 'admin'.toUpperCase())
    )
      return true;
    return false;
  }
  getUsername(): string {
    const decodedToken: any = this.jwtService.decode(this.getToken());
    const username = decodedToken[
      'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'
    ] as string;
    return username;
  }
}

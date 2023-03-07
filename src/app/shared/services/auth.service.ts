import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Login } from 'src/app/core/models/login.model';
import { User } from 'src/app/core/models/user.model';
import { environment } from 'src/environments/environment.development';
import { JWTHelperService } from './jwt-helper.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private router: Router,
    private jwtService: JWTHelperService
  ) {}

  isLoggedin: boolean = false;

  signUp(payload: User) {
    return this.http.post<User>(
      `${environment.baseUrl}${environment.basePath}${environment.authPath}`,
      payload
    );
  }
  login(payload: Login) {
    return this.http.post(
      `${environment.baseUrl}${environment.basePath}${environment.authPath}`,
      payload
    );
  }
  logout() {
    let removeToken = this.getToken();
    if (removeToken == null) {
      this.isLoggedin = false;
      this.router.navigateByUrl('/login');
    }
  }
  isLoggedIn() {
    const token = this.getToken();
    if (token == null && this.jwtService.hasTokenExpired(token)) {
      //REFRESH TOKEN INSTEAD
      return this.isLoggedin;
    } else {
      return true;
    }
  }
  getToken(){
    return localStorage.getItem('token') as string;
  }
}

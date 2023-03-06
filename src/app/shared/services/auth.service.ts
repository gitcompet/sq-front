import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Login } from 'src/app/core/models/login.model';
import { User } from 'src/app/core/models/user.model';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  jwthelper: any;

  constructor(
    private http: HttpClient,
    private router: Router
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
    let removeToken = localStorage.removeItem('token');
    if (removeToken == null) {
      this.router.navigateByUrl('/login');
      this.isLoggedin = false;
    }
  }
   isLoggedIn() {
    if (localStorage.getItem('token') == null) {
      this.isLoggedin = false;
      return this.isLoggedin;
    } else {
      return true;
    }
  }
}

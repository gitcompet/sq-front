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
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private router: Router,
    private jwtService: JWTHelperService
  ) {}

  isLoggedin: boolean = false;

  signUp(payload: User):Observable<User> {
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
    let removeToken = this.getToken();
    if (removeToken == null) {
      this.isLoggedin = false;
      this.router.navigateByUrl('/login');
    }
  }
  isLoggedIn():boolean {
    const token = this.getToken();
    if (token == null && this.jwtService.hasTokenExpired(token)) {
      //REFRESH TOKEN INSTEAD
      return this.isLoggedin;
    } else {
      return true;
    }
  }
  getToken():string{
    return localStorage.getItem('token') as string;
  }
  getRefreshToken():string{
    return localStorage.getItem('refresh') as string;
  }
  setToken(response:TokenResponse){
    localStorage.setItem('token',response.accessToken);
    localStorage.setItem('refresh',response.refreshToken);
  }
  isAdmin():boolean{
    const decodedToken: any = this.jwtService.decode(this.getToken())
    const roles = decodedToken['roles'] as string[];
    if(roles.find((element)=> element === 'admin')) return true;
    return false;
  }
}

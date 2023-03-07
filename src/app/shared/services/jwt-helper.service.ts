import { Injectable } from '@angular/core';
import {JwtHelperService} from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class JWTHelperService {

  constructor(private jwtHelper: JwtHelperService) { }
  decode(token: string): unknown{
   return this.jwtHelper
          .decodeToken(token);
  }
  hasTokenExpired(token: string) : boolean{
   return this.jwtHelper.isTokenExpired(token);
  }
}

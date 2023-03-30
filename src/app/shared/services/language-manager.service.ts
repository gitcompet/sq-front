import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class LanguageManagerService {

  constructor(private jwtService: JwtHelperService,private authService: AuthService) { }

  getCurrentLanguageId(): string{
    const decodedToken  = this.jwtService.decodeToken(this.authService.getToken());
    const properties: string[] = Object.getOwnPropertyNames(decodedToken);
    const key: string = properties.filter((value)=> value.includes("country"))[0];
    const languageId = decodedToken[
      key
    ] as string;
    return languageId;
  }
}

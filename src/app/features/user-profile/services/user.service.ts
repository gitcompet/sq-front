import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { headers } from 'src/app/core/constants/settings';
import { IUser, User } from 'src/app/core/models/user.model';
@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  getProfiles(): Observable<IUser[]> {
    return this.http
      .get<IUser[]>(
        `${environment.baseUrl}${environment.apiVersion}${environment.userPaths.base}`)
      .pipe(
         map(users=> users.map((user)=> {
              const modifiedUser ={} as IUser
              modifiedUser.email = user.email
              modifiedUser.firsName = user.firsName;
              modifiedUser.lastName = user.lastName;
              modifiedUser.login = user.login;
              return modifiedUser;
         }))
      );
  }
}

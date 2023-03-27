import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { IUser, User } from 'src/app/core/models/user.model';
import { Patch } from 'src/app/core/models/patch.model';
import { patchHeaders } from 'src/app/core/constants/settings';
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
  updateUser(payload: User): Observable<User> {
    return this.http.put<User>(
      `${environment.baseUrl}${environment.apiVersion}${environment.userPaths.base}`,
      payload
    );
  }
  patchUser(payload: Patch[]): Observable<User> {
    return this.http.patch<User>(
      `${environment.baseUrl}${environment.apiVersion}${environment.userPaths.base}/20`,
      payload,
      {
        headers: patchHeaders
      }
    );
  }
}

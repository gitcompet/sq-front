import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { IUser } from 'src/app/core/models/user.model';
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
        `${environment.baseUrl}${environment.apiVersion}${environment.userPaths.base}`
      )
      .pipe(
        map((users) =>
          users.map((user) => {
            const modifiedUser = {} as IUser;
            modifiedUser.loginId = user.loginId;
            modifiedUser.email = user.email;
            modifiedUser.firstName = user.firstName;
            modifiedUser.lastName = user.lastName;
            modifiedUser.login = user.login;
            return modifiedUser;
          })
        )
      );
  }
  getProfile(id: string): Observable<IUser> {
    return this.http
      .get<IUser>(
        `${environment.baseUrl}${environment.apiVersion}${environment.userPaths.base}/${id}`
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
  updateUser(payload: IUser): Observable<IUser> {
    return this.http
      .put<IUser>(
        `${environment.baseUrl}${environment.apiVersion}${environment.userPaths.base}/${payload.loginId}`,
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
  patchUser(id: string, payload: Patch[]): Observable<IUser> {
    return this.http
      .patch<IUser>(
        `${environment.baseUrl}${environment.apiVersion}${environment.userPaths.base}/${id}`,
        payload,
        {
          headers: patchHeaders,
        }
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
  deleteUser(id: string): Observable<IUser> {
    return this.http.delete<IUser>(
      `${environment.baseUrl}${environment.apiVersion}${environment.userPaths.base}/${id}`
    );
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { headers } from 'src/app/core/constants/settings';
import { User } from 'src/app/core/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  getProfiles(): Observable<User[]> {
    return this.http.get<User[]>(
      `${environment.baseUrl}${environment.basePath}${environment.usersPath}`,
      {
        headers: headers,
      }
    );
  }
}

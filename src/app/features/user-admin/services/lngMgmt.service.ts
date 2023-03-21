import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { headers } from 'src/app/core/constants/settings';
import { Language } from 'src/app/core/models/language.model';
import { IdResponse } from '../../../core/models/id-response';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  constructor(
    private http: HttpClient
  ) {}

  isLoggedin: boolean = false;

  getLanguages(): Observable<Language[]> {
    return this.http.get<Language[]>(
      `${environment.baseUrl}${environment.apiVersion}${environment.languagesPath}`,
      {
        headers: headers,
      }
    );
  }
  getLanguage(): Observable<Language> {
    return this.http.get<Language>(
      `${environment.baseUrl}${environment.apiVersion}${environment.languagePath}`,
      {
        headers: headers,
      }
    );
  }
  removeLanguages(payload: IdResponse): Observable<IdResponse> {
    return this.http.post<IdResponse>(
      `${environment.baseUrl}${environment.apiVersion}${environment.languageRemovePath}`,
      {
        headers: headers,
      }
    );
  }
  postLanguages(payload: IdResponse): Observable<IdResponse> {
    return this.http.get<IdResponse>(
      `${environment.baseUrl}${environment.apiVersion}${environment.languagePostPath}`,
      {
        headers: headers,
      }
    );
  }
  updateLanguages(payload: IdResponse/*Languages?*/): Observable<IdResponse> {
    return this.http.get<IdResponse>(
      `${environment.baseUrl}${environment.apiVersion}${environment.languageUpdatePath}`,
      {
        headers: headers,
      }
    );
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { headers } from 'src/app/core/constants/settings';
import { Language } from 'src/app/core/models/language.model';
import { Patch } from 'src/app/core/models/patch.model';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  constructor(private http: HttpClient) {}

  isLoggedin: boolean = false;

  getLanguages(): Observable<Language[]> {
    return this.http.get<Language[]>(
      `${environment.baseUrl}${environment.apiVersion}${environment.languagesPaths.base}`,
      {
        headers: headers,
      }
    );
  }
  getLanguage(languageId: string): Observable<Language> {
    return this.http.get<Language>(
      `${environment.baseUrl}${environment.apiVersion}${environment.languagesPaths.base}/${languageId}`,
      {
        headers: headers,
      }
    );
  }
  removeLanguages(languageId: string): Observable<Language> {
    return this.http.delete<Language>(
      `${environment.baseUrl}${environment.apiVersion}${environment.languagesPaths.base}/${languageId}`,
      {
        headers: headers,
      }
    );
  }
  postLanguages(payload: Language): Observable<Language> {
    return this.http.post<Language>(
      `${environment.baseUrl}${environment.apiVersion}${environment.languagesPaths.base}`,
      payload,
      {
        headers: headers,
      }
    );
  }
  updateLanguages(payload: Language): Observable<Language> {
    return this.http.patch<Language>(
      `${environment.baseUrl}${environment.apiVersion}${environment.languagesPaths.base}/${payload.languageId}`,
      payload,
      {
        headers: headers,
      }
    );
  }
}

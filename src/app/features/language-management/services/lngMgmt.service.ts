import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { headers } from 'src/app/core/constants/settings';
import { Language } from 'src/app/core/models/language.model';

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
      `${environment.baseUrl}${environment.basePath}${environment.languagesPath}`,
      {
        headers: headers,
      }
    );
  }

  getLanguagesFake() {
    const temp: Language = {
      title: "French",
      code: "FR",
      display: true
    };
    const temp2: Language = {
      title: "English",
      code: "En",
      display: true
    };
    const temp3: Language = {
      title: "Turk",
      code: "TR",
      display: true
    };
    const temp4: Language = {
      title: "Mongols",
      code: "MG",
      display: true
    };
    let list: Array<Language> = [temp, temp2, temp3, temp4]
    return list
  }

  getLanguageFake() {
    const temp: Language = {
      title: "",
      code: "",
      display: true
    };
    return temp
  }
}

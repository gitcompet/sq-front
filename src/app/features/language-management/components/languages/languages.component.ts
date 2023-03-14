import { Component, OnInit } from '@angular/core';
import { LanguageService } from '../../services/lngMgmt.service';
import { ActivatedRoute } from '@angular/router';
import { Language } from 'src/app/core/models/language.model';

@Component({
  selector: 'app-languagesManagement-language',
  templateUrl: './languages.component.html',
  styles: [
  ]
})
export class LanguagesComponent implements OnInit {
  languages: Language[] = [];
  headers: string[] = ['Title', 'Domain', 'Subdomain', 'Action'];
  constructor(
    private dbConnector: LanguageService,
    public route: ActivatedRoute
  ) { }

  ngOnInit() {
    //this.languages = this.dbConnector.getLanguagesFake();
    console.log("==================================");
     this.dbConnector.getLanguages().subscribe((res) => {
       this.languages = res;
       console.log('languages :' + JSON.stringify(this.languages));
     });
    console.log("==================================");
  }

  test() {
    console.log("test");
  }
}

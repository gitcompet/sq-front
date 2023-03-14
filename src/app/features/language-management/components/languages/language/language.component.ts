import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LanguageService } from '../../../services/lngMgmt.service';
import { Language } from 'src/app/core/models/language.model';

@Component({
  selector: 'app-languagesManagement-language',
  templateUrl: './language.component.html',
  styles: [
  ]
})
export class LanguageComponent implements OnInit{
   language:Language = {} as Language;

  constructor(
    private dbConnector: LanguageService,
    private route: ActivatedRoute
   ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const languageTitle = params['language'];
      this.language = this.dbConnector.getLanguageFake();
      this.language.title = languageTitle;
    })
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Language } from 'src/app/core/models/language.model';
import { LanguageService } from '../../services/lngMgmt.service';

@Component({
  selector: 'app-languagesManagement-language',
  templateUrl: './languages.component.html',
  styles: [
  ]
})
export class LanguagesComponent implements OnInit {
  languages: Language[] = [];
  libelle: String[] = ["Nom de la langue","Code pays en 2 lettres"];
  headers: string[] = ['Title', 'Domain', 'Subdomain', 'Action'];
  public show:boolean[] = [];
  public buttonName:any = 'Show';
  constructor(
    private dbConnector: LanguageService,
    public route: ActivatedRoute
  ) { }

  ngOnInit() {
    //this.languages = this.dbConnector.getLanguagesFake();
    //console.log("==================================");
     this.dbConnector.getLanguages().subscribe((res) => {
       this.languages = res;
       //console.log('languages :' + JSON.stringify(this.languages));
	   for (let i=0; i<res.length; i++)
		{
			this.show.push(false);
		}
     });
    //console.log("==================================");
  }

  toggleVisible(i: number): void {
    this.show[i] = !this.show[i];
  }
  trashThis(language: Language)
  {
	//this.dbConnector.removeLanguages(language.languagesId)
  }
  updateThis(language: Language)
  {
	//this.dbConnector.updateLanguages()
  }
  addThis()
  {
	//this.dbConnector.addLanguages(new IdResponse())
  }
}

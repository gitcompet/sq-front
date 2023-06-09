import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{
  data : any= {};
  constructor(private authService: AuthService){}
 ngOnInit(){
  this.data.username = this.authService.getUsername();
 }
}

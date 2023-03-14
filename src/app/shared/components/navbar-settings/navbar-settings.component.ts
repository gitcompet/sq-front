import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar-settings',
  templateUrl: './navbar-settings.component.html',
  styleUrls: ['./navbar-settings.component.css']
})
export class NavbarSettingsComponent implements OnInit {
 @Input() data : any;
 isOpen: boolean = false;
 constructor(private authService: AuthService){}
 ngOnInit(){
 }
 toggleProfileMenu(){

 }
}

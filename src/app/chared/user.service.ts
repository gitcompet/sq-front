import { Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AppRoutingModule } from '../app-routing.module';
import {HttpClient} from '@angular/common/http';
import { User } from './user.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
// import {JwHelperService} from '@auth0/angular-jwt'

@Injectable({
  providedIn: 'root'
})
export class UserService {
  jwthelper: any;

  constructor(private fb:FormBuilder, private http:HttpClient , private router:Router) { }
  readonly BaseURI='http://localhost:5812/api';
  list:User[] =[]
  formModel= this.fb.group({
    UserName:[''],
    Email:[''],
    FullName:[''],
    // PassWords:this.fb.group({
Password:[''],
ConfirmedPassword:['']
    // })
  });
   headers= new HttpHeaders()
  .set('content-type', 'application/json')
  // .set('Access-Control-Allow-Origin', '*')
  // .set('Access-Control-Allow-Origin', 'http://localhost:4200')
  .append('content-type', 'text/plain; charset=utf-8')
  .append('content-type','application/x-www-form-urlencoded');

  // public isAuthenticated():boolean{
  //   cont token= localStorage.getItem('token');
  //   return !this.jwthelper.asObservable();
  // }
  // isloginSubject= new BehaviorSubject<boolean>(this.isAuthenticated());
  // get isLogin1()
  // {
  //   return this.isloginSubject.asObservable();
  // }
  private loggedIN = new BehaviorSubject<boolean>(false);
  public currentUserSubject:BehaviorSubject<any> = new BehaviorSubject<any>({});
  public currentUser:Observable<User> = new Observable;
  isLoggedin: boolean = false;

  register()
  {
    var body = {
      userName:this.formModel.value.UserName,
      email:this.formModel.value.Email,
      FullName:this.formModel.value.FullName,
      password:this.formModel.value.Password
  };
  console.log("formmodel"+ JSON.stringify( this.formModel.value));
  console.log("body"+ JSON.stringify( body));
 return  this.http.post(this.BaseURI + '/ApplicationUser/register', body);
}
login(formData:FormData)
{
return this.http.post(this.BaseURI+'/ApplicationUser/register', formData);
}
dologout()
{
  let removeToken = localStorage.removeItem('token');
  if(removeToken==null)
  {
    this.router.navigateByUrl('user/login');
    this.isLoggedin = false;
  }
}
// isLoggedIn() {

//   if (JSON.parse(localStorage.getItem('currentUser')).auth_token == null) {
//     this.isLoggedin = false;
//     localStorage.getItem('token')
//     return this.isLoggedin;
//   }
//   else {
//     return true;
//   }
// }
isLoggedIn() {
  debugger;
  if (localStorage.getItem("token") == null) {
    this.isLoggedin = false;
    return this.isLoggedin;
  }
  else {
    return true;
  }
}



GetProfiles()
{
  console.log('headers:'+ this.headers.getAll);
  // return this.http.get(this.BaseURI + '/ApplicationUser/GetUsers', {'headers':this.headers})
  // return this.http.get(this.BaseURI + '/ApplicationUser/GetUsers')
  // .toPromise()
  // .then(res => this.list=res as User[]);
}
GetProfiles1():Observable<any>
{ let body:any={}
const options={responseType:'blob'}
  return this.http.get(this.BaseURI + '/ApplicationUser/GetUsers/', {'headers':this.headers});
}
}

import { Injectable } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../chared/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
private loggedIN = new BehaviorSubject<boolean>(false);
public currentUserSubject:BehaviorSubject<any>;
public currentUser:Observable<User>;
// private formstate = new BehaviorSubject<NgForm>();
// public isUserLoggedIN:BehaviorSubject<boolean>= new BehaviorSubject<boolean>(null);
  constructor() { }
}

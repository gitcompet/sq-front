import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription, fromEvent } from 'rxjs';
import { AuthService } from './shared/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit,OnDestroy{
  title = 'SkillQuizClientApp';
  offlineEvent: Observable<Event>;
  onlineEvent: Observable<Event>;
  _subscriptions: Subscription[] = [];
  constructor(private authService: AuthService, private router:Router){
    this.offlineEvent = new Observable();
    this.onlineEvent = new Observable();
  }
  ngOnInit(): void {

    this.handleAppConnectivityChanges();
    if(!this.authService.hasTokenExpired() && this.router.url === '/login'){
        this.authService.isAdmin() ? this.router.navigateByUrl('/admin/home') : this.router.navigateByUrl('/home')
    }
  }
  private handleAppConnectivityChanges(): void {
    this.onlineEvent = fromEvent(window, 'online');
    this.offlineEvent = fromEvent(window, 'offline');

    this._subscriptions.push(this.onlineEvent.subscribe(e => {
      // handle online mode
      console.log('Online...');
    }));

    this._subscriptions.push(this.offlineEvent.subscribe(e => {
      // handle offline mode
      console.log('Offline...');
    }));
  }

  ngOnDestroy(): void {
    this._subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}



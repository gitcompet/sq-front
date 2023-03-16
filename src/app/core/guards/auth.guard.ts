import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanActivateChild{
  constructor(private _router: Router, private _authService: AuthService) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
      let url: string = state.url;
      return this.checkUserLogin(route, url);
  }
  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):| boolean| UrlTree| Observable<boolean | UrlTree>| Promise<boolean | UrlTree> {
    return this.canActivate(childRoute,state);
  }

  checkUserLogin(router:ActivatedRouteSnapshot,url: any): boolean{
    const isLoggedIn = this._authService.isLoggedIn();
    if(isLoggedIn){
      const isAdmin = this._authService.isAdmin();
      if (!isAdmin) {
        this._router.navigate(['/home']);
        return false;
      }
      return true;
    }
    this._router.navigate(['/']);
    return false;
  }

}

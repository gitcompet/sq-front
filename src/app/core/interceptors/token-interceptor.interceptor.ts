import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const isLoggedIn = this.authService.isLoggedIn();
    const token = this.authService.getToken();
    if (isLoggedIn) {
      request = request.clone({
        headers: new HttpHeaders().set('Authorization',`Bearer ${token}`),
      });
    }

    return next.handle(request).pipe(
      catchError((err) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401) this.router.navigateByUrl('/login');
        }
        return throwError(()=>new Error(err))
      })
    );
  }
}
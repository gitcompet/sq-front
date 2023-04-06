import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Router } from '@angular/router';
import { ErrorHandlerComponent } from '../exceptions/error-handler/error-handler.component';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  private _errorHandler: ErrorHandlerComponent = new ErrorHandlerComponent();
  private isRefreshing = false;
  constructor(private authService: AuthService, private router: Router) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const isLoggedIn = this.authService.isLoggedIn();
    const hasTokenExpired = this.authService.hasTokenExpired();
    const token = this.authService.getToken();
    if (isLoggedIn && !hasTokenExpired) {
      request = request.clone({
        headers: new HttpHeaders().set('Authorization', `Bearer ${token}`),
      });
    }
    return next.handle(request).pipe(
      catchError((err) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401) this.handle401Error(request, next);
        }
        this._errorHandler.handleError(err);
        return throwError(() => new Error(err));
      })
    );
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    const token = this.authService.getToken();
    const refreshToken = this.authService.getRefreshToken();
    if (!this.isRefreshing) {
      this.isRefreshing = true;

      if (this.authService.isLoggedIn()) {
        return this.authService
          .refreshToken({ refreshToken: refreshToken, accessToken: token })
          .pipe(
            switchMap(() => {
              this.isRefreshing = false;

              return next.handle(request);
            }),
            catchError((error) => {
              this.isRefreshing = false;

              if (error.status == '403') {
                this.router.navigateByUrl('/login');
              }

              return throwError(() => error);
            })
          );
      }
    }

    return next.handle(request);
  }
}

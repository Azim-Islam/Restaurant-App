import {AuthService} from './login/auth.service';
import {
  HttpErrorResponse,
  HttpEvent, HttpEventType,
  HttpHandler,
  HttpHandlerFn,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import {BehaviorSubject, catchError, filter, Observable, switchMap, take, throwError} from 'rxjs';
import {inject, Injectable} from '@angular/core';
import {Router} from '@angular/router';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private router = inject(Router);


  constructor(private authService: AuthService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getAuthToken();
    if (token) {
      request = request.clone({
        setHeaders: {Authorization: `Bearer ${token}`, 'Content-Type': 'application/json'}
      });
    }
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          return this.handle401Error(request, next);
        } else {
          return throwError(error);
        }
      })
    );
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.authService.refreshAccessToken().pipe(
        switchMap((token: any) => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(token);
          return next.handle(this.addToken(request, token.accessToken, token.refreshToken));
        }),
        catchError((err) => {
          this.isRefreshing = false;
          this.authService.logOutAdmin();
          this.router.navigate(['']);
          return throwError(err);
        })
      );
    } else {
      return this.refreshTokenSubject.pipe(
        filter(token => token != null),
        take(1),
        switchMap(token => {
          return next.handle(this.addToken(request, token.accessToken, token.refreshToken));
        })
      );
    }



  }

  private addToken(request: HttpRequest<any>, token: string, refreshToken: string) {
    this.authService.authToken.set(token);
    this.authService.refreshToken.set(refreshToken);
    localStorage.setItem('authToken', token);
    localStorage.setItem('refreshToken', refreshToken);

    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
}






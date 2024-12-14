import {AuthService} from './login/auth.service';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpHandlerFn,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import {catchError, Observable, throwError} from 'rxjs';
import {Injectable} from '@angular/core';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private authService: AuthService) {}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getAuthToken();

    if (token) {
      request = request.clone({
        setHeaders: {Authorization: `Bearer ${token}`, 'Content-Type': 'application/json'}
      });
    }

    return next.handle(request);
    //   .pipe(
    //   catchError((err) => {
    //     if (err instanceof HttpErrorResponse) {
    //       if (err.status === 401) {
    //         // redirect user to the logout page
    //       }
    //     }
    //     return throwError(err);
    //   })
    // )
  }
}




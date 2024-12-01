import {effect, inject, Injectable, signal} from '@angular/core';
import {HttpClient, HttpEventType} from '@angular/common/http';

@Injectable({providedIn: 'root'})
export class AuthService {
  private httpClientService = inject(HttpClient);
  loginStatus = signal('');
  isSendingRequest = signal(false);

  constructor() {
    if (localStorage.getItem('loginStatus') === 'valid') {
      this.loginStatus.set('valid');
    }
    effect(() => {
      if (this.loginStatus() === 'valid') {
        localStorage.setItem('loginStatus', 'valid');
      }
      else if (this.loginStatus() === 'invalid') {
        localStorage.removeItem('loginStatus');
      }
    });
  }

  sendLoginRequest(formData: { userName: string | null | undefined; password: string | null | undefined }) {
    if (formData.password && formData.userName) {
      this.httpClientService.post('https://restaurantapi.bssoln.com/api/Auth/SignIn', formData, {observe: 'events'})
        .pipe(
        )
        .subscribe( {
          next: (data) => {
            switch (data.type){
              case HttpEventType.Response:
                if ((data.status) === 200){
                  this.isSendingRequest.set(false);
                  this.loginStatus.set('valid');
                }
                break;
              case HttpEventType.Sent:
                this.isSendingRequest.set(true);
                break;
            }
          },
          error: (err) => {
            this.isSendingRequest.set(false);
            this.loginStatus.set('invalid');
          },
        })
    }
  }
}

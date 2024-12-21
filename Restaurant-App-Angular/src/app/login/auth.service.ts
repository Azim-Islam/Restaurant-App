import {effect, inject, Injectable, signal} from '@angular/core';
import {HttpClient, HttpEventType} from '@angular/common/http';
import {UserProfile} from './auth.interface';

@Injectable({providedIn: 'root'})
export class AuthService {
  private httpClientService = inject(HttpClient);
  loginStatus = signal('');
  authToken = signal('');
  isSendingRequest = signal(false);
  currentUserProfile = signal<UserProfile>(
    {
      id: '',
      fullName: '',
      email: '',
      image: '',
      userName: '',
      phoneNumber: ''
    }
  );

  constructor() {
    if (localStorage.getItem('loginStatus') === 'valid') {
      this.loginStatus.set('valid');
      this.authToken.set(localStorage.getItem('authToken')!);
    }
    effect(() => {
      if (this.loginStatus() === 'valid') {
        localStorage.setItem('loginStatus', 'valid');
        localStorage.setItem('authToken', this.authToken());
      }
      else if (localStorage.getItem('loginStatus') === 'invalid') {
        localStorage.removeItem('loginStatus');
        localStorage.removeItem('authToken');
        this.authToken.set('');
      }
    }, {allowSignalWrites: true});
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
                  if("token" in data.body! && typeof (data.body.token) === 'string'){
                    this.authToken.set(data.body.token);
                  }
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
          complete: () => {
            this.isSendingRequest.set(false);
          }
        })
    }
  }

  logOutAdmin() {
    localStorage.removeItem('loginStatus');
    localStorage.removeItem('authToken');
    this.loginStatus.set('');
    this.authToken.set('');
  }

  getAuthToken() {
    return localStorage.getItem('authToken');
  }

  getUserDetails() {
    this.httpClientService.get<UserProfile>('https://restaurantapi.bssoln.com/api/Auth/profile', {observe: 'events'})
      .pipe(
      )
      .subscribe( {
        next: (data) => {
          switch (data.type){
            case HttpEventType.Response:
              if ((data.status) === 200){
                this.currentUserProfile.set(data.body!);
                console.log(data.body!);
              }
              break;
            case HttpEventType.Sent:
              this.isSendingRequest.set(true);
              break;
          }
        },
        error: (err) => {
        },
        complete: () => {
          this.isSendingRequest.set(false);
        }
      })
  }
}

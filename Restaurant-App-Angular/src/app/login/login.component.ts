import {Component, computed, effect, inject} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AuthService} from './auth.service';
import {NzCarouselModule} from 'ng-zorro-antd/carousel';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NzCarouselModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private loginService = inject(AuthService);
  private router = inject(Router);
  protected chef_logo = "./login_assets/chef_green.png";
  loginStatus = computed(this.loginService.loginStatus);
  loggingIn = computed(this.loginService.isSendingRequest);
  loginForm = new FormGroup({
    email: new FormControl('admin@mail.com'),
    password: new FormControl('Admin@123'),
  })

  constructor() {
    effect(() => {
      if (this.loginService.loginStatus() === 'valid') {
        setTimeout(() => {
          this.router.navigateByUrl('dashboard');
        }, 1000);
      }
    });
  }



  onSubmit() {
    let formData = {userName: this.loginForm.value.email, password: this.loginForm.value.password};
    this.loginService.sendLoginRequest(formData);
  }

}

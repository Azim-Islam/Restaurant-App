import {Component, computed, inject} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {LoginService} from './login.service';

@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private loginService = inject(LoginService);
  protected chef_logo = "./login_assets/chef_green.png";
  loginStatus = computed(this.loginService.loginStatus);
  loggingIn = computed(this.loginService.isSendingRequest);
  loginForm = new FormGroup({
    email: new FormControl('admin@mail.com'),
    password: new FormControl('Admin@123'),
  })

  onSubmit() {
    let formData = {userName: this.loginForm.value.email, password: this.loginForm.value.password};
    this.loginService.sendLoginRequest(formData);
  }
}

import {Router, Routes} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {inject} from '@angular/core';
import {AuthService} from './login/auth.service';

function canVisitDashboard(){
  const authService = inject(AuthService);
  const routerService = inject(Router);
  console.log(authService.loginStatus());
  if (authService.loginStatus() === 'valid') {
    return true;
  }
  if (authService.loginStatus() === 'invalid') {
    routerService.navigateByUrl("");
    return false;
  }
  else{
    routerService.navigateByUrl("");
    return false;
  }
}

export const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [canVisitDashboard],

  }
];

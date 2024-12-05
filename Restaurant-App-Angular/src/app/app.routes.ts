import {Router, Routes} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {inject} from '@angular/core';
import {AuthService} from './login/auth.service';
import {NzModalService} from 'ng-zorro-antd/modal';

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
    loadComponent: () => import('./dashboard/dashboard.component')
      .then(c => c.DashboardComponent),
    canActivate: [canVisitDashboard],
    children: [
      {
        path: 'employees',
        loadComponent: () => import('./dashboard/employees/employees.component')
          .then(c => c.EmployeesComponent),
      },
      {
        path: 'tables',
        loadComponent: () => import('./dashboard/tables/tables.component')
          .then(c => c.TablesComponent)
      },
      {
        path: 'foods',
        loadComponent: () => import('./dashboard/foods/foods.component')
          .then(c => c.FoodsComponent)
      },      {
        path: 'new-order',
        loadComponent: () => import('./dashboard/new-order/new-order.component')
          .then(c => c.NewOrderComponent)
      },
      {
        path: 'orders',
        loadComponent: () => import('./dashboard/orders/orders.component')
          .then(c => c.OrdersComponent)
      }
    ]
  }
];

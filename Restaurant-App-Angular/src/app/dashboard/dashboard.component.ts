import {Component, inject, signal} from '@angular/core';
import {NzContentComponent, NzHeaderComponent, NzLayoutComponent, NzSiderComponent} from 'ng-zorro-antd/layout';
import {NzBreadCrumbComponent} from 'ng-zorro-antd/breadcrumb';
import {NzMenuDirective, NzMenuItemComponent, NzSubMenuComponent} from 'ng-zorro-antd/menu';
import {NzIconDirective} from 'ng-zorro-antd/icon';
import {AuthService} from '../login/auth.service';
import {Router} from '@angular/router';
import {EmployeesComponent} from './employees/employees.component';
import {TablesComponent} from './tables/tables.component';
import {NewOrderComponent} from './new-order/new-order.component';
import {OrdersComponent} from './orders/orders.component';
import {FoodsComponent} from './foods/foods.component';





@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    NzLayoutComponent,
    NzSiderComponent,
    NzHeaderComponent,
    NzContentComponent,
    NzMenuDirective,
    NzMenuItemComponent,
    NzIconDirective,
    EmployeesComponent,
    TablesComponent,
    NewOrderComponent,
    OrdersComponent,
    FoodsComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  sideBarItems = [
    {
      ItemName: "Employees",
      IconName: "idcard",
    },
    {
      ItemName: "Tables",
      IconName: "group",
    },
    {
      ItemName: "Foods",
      IconName: "pie-chart",
    },
    {
      ItemName: "New Order",
      IconName: "plus-square",
    },
    {
      ItemName: "Orders",
      IconName: "ordered-list",
    },



  ]
  currentComponent = signal('Employees'); // Hardcoded initial value
  isCollapsed = false;



  onLogout() {
    this.authService.logOutAdmin();
    this.router.navigate(['']);
  }

  setComponent(menuItemName: string) {
    this.currentComponent.set(menuItemName);
  }
}

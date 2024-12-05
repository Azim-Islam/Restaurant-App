import {Component, inject, OnInit, signal} from '@angular/core';
import {NzContentComponent, NzHeaderComponent, NzLayoutComponent, NzSiderComponent} from 'ng-zorro-antd/layout';
import {NzMenuDirective, NzMenuItemComponent} from 'ng-zorro-antd/menu';
import {NzIconDirective} from 'ng-zorro-antd/icon';
import {AuthService} from '../login/auth.service';
import {Router, RouterOutlet} from '@angular/router';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {NgClass} from '@angular/common';
import {AddEmployeeComponent} from './employees/add-employee/add-employee.component';

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
    NgClass,
    RouterOutlet,
    AddEmployeeComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
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
  isCollapsed = true;
  responsive = inject(BreakpointObserver);

    ngOnInit() {
      this.isCollapsed = true;
      this.router.navigate(['dashboard/employees']);
      this.responsive.observe([Breakpoints.Large, ])
        .subscribe(result => {
          this.isCollapsed = true;
          if (result.matches) {
            this.isCollapsed = false;
          }
        });
    }


  onLogout() {
    this.authService.logOutAdmin();
    this.router.navigate(['']);
  }

  setComponent(menuItemName: string) {
    this.currentComponent.set(menuItemName);
    switch (this.currentComponent()){
      case 'Employees':
        this.router.navigate(['dashboard/employees']);
        break;
      case 'Tables':
        this.router.navigate(['dashboard/tables']);
        break;
      case 'Foods':
        this.router.navigate(['dashboard/foods']);
        break;
      case 'New Order':
        this.router.navigate(['dashboard/new-order']);
        break;
      case 'Orders':
        this.router.navigate(['dashboard/orders']);
        break;
    }
  }

  protected readonly ondragover = ondragover;

  showSider() {
    this.isCollapsed = false;
  }

  hideSider() {
    this.isCollapsed = true;
  }
}

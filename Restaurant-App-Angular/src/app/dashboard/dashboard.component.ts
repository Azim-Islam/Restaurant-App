import {Component, inject, OnInit, signal} from '@angular/core';
import {NzContentComponent, NzHeaderComponent, NzLayoutComponent, NzSiderComponent} from 'ng-zorro-antd/layout';
import {NzMenuDirective, NzMenuItemComponent} from 'ng-zorro-antd/menu';
import {NzIconDirective} from 'ng-zorro-antd/icon';
import {AuthService} from '../login/auth.service';
import {ActivatedRoute, NavigationEnd, Router, RouterEvent, RouterOutlet} from '@angular/router';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {NgClass} from '@angular/common';
import {AddEmployeeComponent} from './employees/add-employee/add-employee.component';
import {NgStyleInterface} from 'ng-zorro-antd/core/types';
import {filter} from 'rxjs';

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
  currentComponent = signal('');
  isCollapsed = true;

  responsive = inject(BreakpointObserver);

  constructor(private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    let childRoute = this.activatedRoute.firstChild;
    if (childRoute) {
      console.log('Activated Child Route:', childRoute.snapshot.routeConfig?.path);
      if (childRoute.snapshot.routeConfig?.path) {
        switch (childRoute.snapshot.routeConfig?.path){
          case 'employees':
            this.currentComponent.set('Employees');
            break;
          case 'tables':
            this.currentComponent.set('Tables');
            break;
          case 'new-order':
            this.currentComponent.set('New Order');
            break;
          case 'foods':
            this.currentComponent.set('Foods');
            break;
          case 'orders':
            this.currentComponent.set('Orders');
            break;
        }
      }
    }
    else{
      this.currentComponent.set('Employees');
      this.router.navigate(['dashboard/employees']);
    }

    this.isCollapsed = true;
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

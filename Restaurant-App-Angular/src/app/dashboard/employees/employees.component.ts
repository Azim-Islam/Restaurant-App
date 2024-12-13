import {Component, effect, inject, Injector, OnInit} from '@angular/core';
import {EmployeeBackendService} from './employee-backend.service';
import {NzTableModule, NzTableQueryParams} from 'ng-zorro-antd/table';
import {NzAvatarComponent} from 'ng-zorro-antd/avatar';
import {NzIconDirective} from 'ng-zorro-antd/icon';
import {AddEmployeeComponent} from './add-employee/add-employee.component';
import {NzModalComponent, NzModalService} from 'ng-zorro-antd/modal';
import {toObservable} from '@angular/core/rxjs-interop';
import {NzTooltipDirective} from 'ng-zorro-antd/tooltip';
export type ThemeType = "fill" | "outline" | "twotone"
@Component({
  selector: 'app-employees',
  standalone: true,
  providers: [NzModalService],
  imports: [NzTableModule, NzAvatarComponent, NzIconDirective, AddEmployeeComponent, NzTooltipDirective],
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.css'
})
export class EmployeesComponent implements OnInit {
  protected backendService = inject(EmployeeBackendService);
  listOfEmployees = this.backendService.listOfEmployees;
  imageBaseUrl = 'https://restaurantapi.bssoln.com/images/user/'
  private injector = inject(Injector);

  ngOnInit() {
    this.loadDataFromServer(this.pageIndex, this.backendService.totalEmployees());
  }

  pageSize = 10;
  pageIndex = 1;
  starMarked: ThemeType = 'twotone';

  constructor() {
    effect(() => {
      if (this.backendService.triggerRefresh()) {
        this.ngOnInit();
        this.backendService.triggerRefresh.set(false);
      }
    }, {allowSignalWrites: true});
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    this.pageIndex = params.pageIndex;
    this.pageSize = params.pageSize;
    this.loadDataFromServer(this.pageIndex, this.pageSize);
  }

  loadDataFromServer(
    pageIndex: number,
    pageSize: number,
  ): void {
    this.backendService.getListOFEmployees('', pageIndex.toString(), pageSize.toString(), '');
  }

  deleteUser(id: string) {
    this.backendService.deleteUser(id);
    if (this.backendService.listOfEmployees().length <= 1) {
      this.pageIndex = Math.max(1, this.pageIndex - 1);
    }
  }

  getImageUrl(imageUrl: string) {
    return this.imageBaseUrl + "/" + imageUrl;
  }

  toggleStar() {
    if (this.starMarked === 'fill') {
      this.starMarked = 'twotone';
    }
    else{
      this.starMarked = 'fill';
    }
  }
}


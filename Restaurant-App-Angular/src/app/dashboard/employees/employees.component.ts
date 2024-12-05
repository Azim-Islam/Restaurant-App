import {Component, effect, inject, OnInit} from '@angular/core';
import {EmployeeBackendService} from './employee-backend.service';
import {NzTableModule, NzTableQueryParams} from 'ng-zorro-antd/table';
import {NzAvatarComponent} from 'ng-zorro-antd/avatar';
import {NzIconDirective} from 'ng-zorro-antd/icon';
import {AddEmployeeComponent} from './add-employee/add-employee.component';
import {NzModalComponent, NzModalService} from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-employees',
  standalone: true,
  providers: [NzModalService],
  imports: [NzTableModule, NzAvatarComponent, NzIconDirective, AddEmployeeComponent, NzModalComponent],
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.css'
})
export class EmployeesComponent implements OnInit {
  protected backendService = inject(EmployeeBackendService);
  listOfEmployees = this.backendService.listOfEmployees;
  imageBaseUrl = 'https://restaurantapi.bssoln.com/images/user/'

  ngOnInit() {
    this.loadDataFromServer(this.pageIndex, this.backendService.totalEmployees());
  }

  pageSize = 10;
  pageIndex = 1;
  constructor() {
    effect(() => {
      if (this.backendService.triggerRefresh()) {
        this.ngOnInit();
        this.backendService.triggerRefresh.set(false);
        console.log(this.backendService.triggerRefresh());
      }
    }, {allowSignalWrites: true});
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    console.log(params);
    const {pageSize, pageIndex} = params;
    this.loadDataFromServer(pageIndex, pageSize);
  }

  loadDataFromServer(
    pageIndex: number,
    pageSize: number,
  ): void {
    this.backendService.getListOFEmployees('', pageIndex.toString(), pageSize.toString(), '');
    console.log(this.backendService.listOfEmployees())
  }

  deleteUser(id: string) {
    this.backendService.deleteUser(id);

  }

  getImageUrl(imageUrl: string) {
    return this.imageBaseUrl + "/" + imageUrl;
  }
}


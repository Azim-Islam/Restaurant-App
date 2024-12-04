import {Component, computed, effect, inject, OnInit, signal} from '@angular/core';
import {EmployeeBackendService} from '../employee-backend.service';
import {NzTableModule, NzTableQueryParams} from 'ng-zorro-antd/table';
import {HttpClient, HttpParams} from '@angular/common/http';
import {NzAvatarComponent} from 'ng-zorro-antd/avatar';
import {NzButtonComponent} from 'ng-zorro-antd/button';
import {NzDropDownDirective, NzDropdownMenuComponent} from 'ng-zorro-antd/dropdown';
import {NzMenuDirective, NzMenuItemComponent} from 'ng-zorro-antd/menu';
import {NzIconDirective} from 'ng-zorro-antd/icon';


@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [NzTableModule, NzAvatarComponent, NzButtonComponent, NzDropDownDirective, NzDropdownMenuComponent, NzMenuDirective, NzMenuItemComponent, NzIconDirective],
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.css'
})
export class EmployeesComponent implements OnInit {
  protected backendService = inject(EmployeeBackendService);
  private http = inject(HttpClient);
  listOfEmployees = this.backendService.listOfEmployees;
  imageBaseUrl = 'https://restaurantapi.bssoln.com/images/user/'

  ngOnInit() {
    this.loadDataFromServer(1, 10);
  }

  total = 1;
  pageSize = 10;
  pageIndex = 1;
  filterDesignation = [
    { text: 'Manager', value: 'Manager' },
    { text: 'Chef', value: 'Chef' },
    { text: 'Cleaner', value: 'Cleaner' },
  ];

  constructor() {
    effect( () => {
      if (this.backendService.triggerRefresh()) {
        this.ngOnInit();
        this.backendService.triggerRefresh.set(false);
        console.log(this.backendService.triggerRefresh());
      }
    }, {allowSignalWrites: true});
  }



  onQueryParamsChange(params: NzTableQueryParams): void {
    console.log(params);
    const { pageSize, pageIndex, sort, filter } = params;
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
    return this.imageBaseUrl+"/"+imageUrl;
  }
}


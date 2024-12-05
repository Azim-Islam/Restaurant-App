import {effect, inject, Injectable, signal} from '@angular/core';
import {HttpClient, HttpEventType, HttpParams} from '@angular/common/http';
import {Employee, ResponseListOfEmployees} from './employee.interface';
import {EmployeesComponent} from './employees.component';
import {inNextTick} from 'ng-zorro-antd/core/util';


function getSanitizedListOfEmployee(data: ResponseListOfEmployees | null) {
  let ListOfEmployees: Employee[] = [];
  return data!.data;
}

@Injectable({providedIn: 'root'})
export class EmployeeBackendService {
  private baseUrl = "https://restaurantapi.bssoln.com"
  private httpClientService = inject(HttpClient);
  isSendingRequest = signal(false);
  triggerRefresh = signal(false);
  listOfEmployees = signal<Employee[]>([]);
  totalEmployees = signal(10);
  showAddModal = signal(false);

  constructor() {
    effect(() => {
      console.log(this.showAddModal());
    });
  }

  getListOFEmployees(sortBy: string, page: string, per_page: string, search: string){
    let params = new HttpParams()
      .append('Sort', sortBy)
      .append('Page', page)
      .append('Per_Page', per_page)

    this.httpClientService.get<ResponseListOfEmployees>(this.baseUrl+`/api/Employee/datatable/`, {observe: 'events', params: params})
      .pipe(
      )
      .subscribe( {
        next: (data) => {
          switch (data.type){
            case HttpEventType.Response:
              if ((data.status) === 200){
                this.listOfEmployees.set(getSanitizedListOfEmployee(data.body));
                this.totalEmployees.set(data.body!.totalRecords);
                this.isSendingRequest.set(false);
              }
              break;
            case HttpEventType.Sent:
              this.isSendingRequest.set(true);
              break;
          }
        },
        error: (err) => {
          this.isSendingRequest.set(false);
        },
        complete: () => {
        }
      });
  }

  deleteUser(id: string) {
      this.httpClientService.delete(this.baseUrl+`/api/Employee/delete/${id}`, {observe: 'events'})
      .pipe()
      .subscribe( {
        next: (data) => {
          switch (data.type){
            case HttpEventType.Response:
              if ((data.status) === 204){
                this.isSendingRequest.set(false);

              }
              break;
            case HttpEventType.Sent:
              this.isSendingRequest.set(true);
              break;
          }
        },
        error: (err) => {
          this.isSendingRequest.set(false);
        },
        complete: () => {
          this.triggerRefresh.set(true);
        }
      })
    ;

  }

}


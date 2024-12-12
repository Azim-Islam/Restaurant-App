import {effect, inject, Injectable, signal} from '@angular/core';
import {HttpClient, HttpEventType, HttpParams} from '@angular/common/http';
import {CreateEmployee, Employee, ResponseListOfEmployees} from './employee.interface';


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

  addNewEmployee(postData: CreateEmployee) {
    this.httpClientService.post(this.baseUrl+`/api/Employee/create`, postData, {observe: 'events'})
      .pipe(
      )
      .subscribe( {
        next: (data) => {
          switch (data.type){
            case HttpEventType.Response:
              if ((data.status) === 200){
                this.isSendingRequest.set(false);
                this.triggerRefresh.set(true);
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
          this.isSendingRequest.set(false);
        }
      })

  }

}


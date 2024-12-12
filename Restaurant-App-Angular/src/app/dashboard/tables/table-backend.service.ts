import {effect, inject, Injectable, signal} from '@angular/core';
import {HttpClient, HttpEventType, HttpParams} from '@angular/common/http';
import {CreateFood, ResponseAvailableEmployees, ResponseTableList, Table} from './table.interface';
import {Employee, ResponseListOfEmployees} from '../employees/employee.interface';


function getSanitizedListOfEmployee(data: ResponseListOfEmployees | null) {
  return data!.data;
}

function getSanitizedListOfTable(data: ResponseTableList | null) {
  return data!.data;
}

function getAvailableEmployee(data: ResponseAvailableEmployees[] | null, listOfEmployees: Employee[]): Employee[] {
  let employees: Employee[] = [];
  listOfEmployees.forEach(employee => {
      if (data){
        data.forEach(item => {
          if (item.employeeId == employee.id) {
            employees.push(employee);
          }
        })
      }
  })
  return employees;
}

@Injectable({providedIn: 'root'})
export class TableBackendService {
  private baseUrl = "https://restaurantapi.bssoln.com"
  private httpClientService = inject(HttpClient);
  isSendingRequest = signal(false);
  triggerRefresh = signal(false);
  listOfTable = signal<Table[]>([]);
  listOfEmployees = signal<Employee[]>([]);
  totalTable = signal(10);
  showAddModal = signal(false);
  showAssignModal = signal(false);

  listOfAvailableEmployees = signal<Employee[]>([]);
  assignTableNumber = signal('');
  assignTableImage = signal('');
  assignTableSeats = signal(0);
  isLoadingEmployees = signal(false);
  isLoadingTables = signal(false);


  constructor() {
    effect(() => {
    });
  }

  getListOfTables(sortBy: string, page: string, per_page: string, search: string){
    let params = new HttpParams()
      .append('Sort', sortBy)
      .append('Page', page)
      .append('Per_Page', per_page)

    this.httpClientService.get<ResponseTableList>(this.baseUrl+`/api/Table/datatable`, {observe: 'events', params: params})
      .pipe(
      )
      .subscribe( {
        next: (data) => {
          switch (data.type){
            case HttpEventType.Response:
              if ((data.status) === 200){
                this.listOfTable.set(getSanitizedListOfTable(data.body));
                this.totalTable.set(data.body!.totalRecords);
              }
              break;
            case HttpEventType.Sent:
              this.isSendingRequest.set(true);
              this.isLoadingTables.set(true);
              break;
          }
        },
        error: (err) => {
          this.isLoadingTables.set(false);
        },
        complete: () => {
          this.isLoadingTables.set(false);
        }
      });
  }

  loadFullListOfEmployee(){
    let params = new HttpParams()
      .append('Sort', '')
      .append('Page', 1)
      .append('Per_Page', 10000)

    this.httpClientService.get<ResponseListOfEmployees>(this.baseUrl+`/api/Employee/datatable/`, {observe: 'events', params: params})
      .pipe(
      )
      .subscribe( {
        next: (data) => {
          switch (data.type){
            case HttpEventType.Response:
              if ((data.status) === 200){
                this.listOfEmployees.set(getSanitizedListOfEmployee(data.body));
              }
              break;
            case HttpEventType.Sent:
              this.isSendingRequest.set(true);
              this.isLoadingEmployees.set(true);
              break;
          }
        },
        error: (err) => {
          this.isLoadingEmployees.set(false);
        },
        complete: () => {
          this.isLoadingEmployees.set(false);
        }
      });

  }

  deleteTable(id: Number) {
      this.httpClientService.delete(this.baseUrl+`/api/Table/delete/${id}`, {observe: 'events'})
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
      });

  }

  addNewFood(postData: CreateFood) {
    this.httpClientService.post(this.baseUrl+`/api/Food/create`, postData, {observe: 'events'})
      .pipe(
      )
      .subscribe( {
        next: (data) => {
          switch (data.type){
            case HttpEventType.Response:
              if ((data.status) === 200){
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
          this.isSendingRequest.set(false);
        }
      })

  }

  removeEmployeeFromTable(employeeTableId: string) {
    this.httpClientService.delete(this.baseUrl+`/api/EmployeeTable/delete/${employeeTableId}`, {observe: 'events'})
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
      });
  }

  loadListOfAvailableEmployees(tableId: string) {
    this.httpClientService.get<ResponseAvailableEmployees[]>(this.baseUrl+`/api/Employee/non-assigned-employees/${tableId}`, {observe: 'events'})
      .pipe(
      )
      .subscribe( {
        next: (data) => {
          switch (data.type){
            case HttpEventType.Response:
              if ((data.status) === 200){
                this.listOfAvailableEmployees.set(getAvailableEmployee(data.body, this.listOfEmployees()));
              }
              break;
            case HttpEventType.Sent:
              break;
          }
        },
        error: (err) => {
        },
        complete: () => {
        }
      });

  }

  assignEmployeeToTable(selectedEmployee: string, s: string) {
    let postData = {
      employeeId: selectedEmployee,
      tableId: s,
    }
    this.httpClientService.post(this.baseUrl+`/api/EmployeeTable/create`, postData, {observe: 'events'})
      .pipe(
      )
      .subscribe( {
        next: (data) => {
          switch (data.type){
            case HttpEventType.Response:
              if ((data.status) === 200){
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
          this.isSendingRequest.set(false);
        }
      })
  }
}


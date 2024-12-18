import {effect, inject, Injectable, signal} from '@angular/core';
import {HttpClient, HttpEventType, HttpParams} from '@angular/common/http';
import {CreateFood, FoodItem, ResponseFoodList} from '../foods/food.interface';
import {ResponseTableList, Table} from '../tables/table.interface';
import {CartFoodItem, PostOrder} from '../new-order/new-order.interface';
import {MessageService} from '../../message.service';
import {OrderData, ResponseOrderList} from './orders.interface';


function getSanitizedListOfTable(data: ResponseTableList | null) {
  return data!.data;
}

function getSanitizedListOfFood(data: ResponseFoodList | null) {
  return data!.data;
}

function getSanitizedListOfOrder(data: ResponseOrderList | null) {
  return data!.data;
}


@Injectable({providedIn: 'root'})
export class OrdersBackendService {
  private baseUrl = "https://restaurantapi.bssoln.com"
  private httpClientService = inject(HttpClient);
  private messageService = inject(MessageService);
  isSendingRequest = signal(false);
  triggerRefresh = signal(false);
  listOfFood = signal<FoodItem[]>([]);
  totalFood = signal(0);
  totalTable = signal(0);
  cartFood = signal<CartFoodItem[]>([]);
  selectedTableId = signal('');
  listOfTable = signal<Table[]>([]);

  listOfOrder = signal<OrderData[]>([]);
  totalOrder = signal(0);

  constructor() {
    effect(() => {
    });
  }

  getListOFFood(sortBy: string, page: string, per_page: string, search: string){
    let params = new HttpParams()
      .append('Sort', sortBy)
      .append('Page', page)
      .append('Per_Page', per_page)
      .append('Search', search);

    this.httpClientService.get<ResponseFoodList>(this.baseUrl+`/api/Food/datatable/`, {observe: 'events', params: params})
      .pipe(
      )
      .subscribe( {
        next: (data) => {
          switch (data.type){
            case HttpEventType.Response:
              if ((data.status) === 200){
                this.listOfFood.set(getSanitizedListOfFood(data.body));
                this.totalFood.set(data.body!.totalRecords);
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
              break;
          }
        },
        error: (err) => {
          this.isSendingRequest.set(false);
        },
        complete: () => {
          this.isSendingRequest.set(false);
        }
      });
  }


  getListOfOrder(sortBy: string, page: number, per_page: number, search: string){
    let params = new HttpParams()
      .append('Sort', sortBy)
      .append('Page', page)
      .append('Per_Page', per_page)
      .append('Search', search);

    this.httpClientService.get<ResponseOrderList>(this.baseUrl+`/api/Order/datatable`, {observe: 'events', params: params})
      .pipe(
      )
      .subscribe( {
        next: (data) => {
          switch (data.type){
            case HttpEventType.Response:
              if ((data.status) === 200){
                this.listOfOrder.set(getSanitizedListOfOrder(data.body));
                this.totalOrder.set(data.body!.totalRecords);
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
      });
  }

}


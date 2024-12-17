import {effect, inject, Injectable, signal} from '@angular/core';
import {HttpClient, HttpEventType, HttpParams} from '@angular/common/http';
import {CreateFood, FoodItem, ResponseFoodList} from '../foods/food.interface';
import {ResponseTableList, Table} from '../tables/table.interface';
import {CartFoodItem, PostOrder} from './new-order.interface';
import {MessageService} from '../../message.service';


function getSanitizedListOfTable(data: ResponseTableList | null) {
  return data!.data;
}

function getSanitizedListOfFood(data: ResponseFoodList | null) {
  return data!.data;
}

@Injectable({providedIn: 'root'})
export class NewOrderBackendService {
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


  createOrder(POST_DATA: PostOrder) {
    this.httpClientService.post(this.baseUrl+`/api/Order/create`, POST_DATA, {observe: 'events'})
      .pipe(
      )
      .subscribe( {
        next: (data) => {
          switch (data.type){
            case HttpEventType.Response:
              if ((data.status) === 200){
                this.isSendingRequest.set(false);
                this.cartFood.set([]);
                this.messageService.createMessage('success', 'Order Created Successfully!');
              }
              break;
            case HttpEventType.Sent:
              this.isSendingRequest.set(true);
              this.messageService.createMessage('info', 'Order Placed.');
              break;
          }
        },
        error: (err) => {
          this.isSendingRequest.set(false);
          this.messageService.createMessage('error', 'Error Creating Order');
        },
        complete: () => {
          this.isSendingRequest.set(false);
        }
      })
  }
}


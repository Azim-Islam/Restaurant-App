import {effect, inject, Injectable, signal} from '@angular/core';
import {HttpClient, HttpEventType, HttpParams} from '@angular/common/http';
import {CreateFood, FoodItem, ResponseFoodList} from './food.interface';
import {MessageService} from '../../message.service';


function getSanitizedListOfEmployee(data: ResponseFoodList | null) {
  return data!.data;
}

@Injectable({providedIn: 'root'})
export class FoodBackendService {
  private baseUrl = "https://restaurantapi.bssoln.com"
  private httpClientService = inject(HttpClient);
  private messageService = inject(MessageService);
  isSendingRequest = signal(false);
  triggerRefresh = signal(false);
  listOfFood = signal<FoodItem[]>([]);
  totalFood = signal(10);
  showAddModal = signal(false);

  constructor() {
    effect(() => {
    });
  }

  getListOFFood(sortBy: string, page: string, per_page: string, search: string){
    let params = new HttpParams()
      .append('Sort', sortBy)
      .append('Page', page)
      .append('Per_Page', per_page)

    this.httpClientService.get<ResponseFoodList>(this.baseUrl+`/api/Food/datatable/`, {observe: 'events', params: params})
      .pipe(
      )
      .subscribe( {
        next: (data) => {
          switch (data.type){
            case HttpEventType.Response:
              if ((data.status) === 200){
                this.listOfFood.set(getSanitizedListOfEmployee(data.body));
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
          this.messageService.createMessage('error', 'Error Processing The Request. Please Try Again...');
          this.isSendingRequest.set(false);
        },
        complete: () => {
        }
      });
  }

  deleteFood(id: Number) {
      this.httpClientService.delete(this.baseUrl+`/api/Food/delete/${id}`, {observe: 'events'})
      .pipe()
      .subscribe( {
        next: (data) => {
          switch (data.type){
            case HttpEventType.Response:
              if ((data.status) === 204){
                this.messageService.createMessage('success', 'Food Item Removed Successfully!')
                this.isSendingRequest.set(false);
              }
              break;
            case HttpEventType.Sent:
              this.isSendingRequest.set(true);
              break;
          }
        },
        error: (err) => {
          this.messageService.createMessage('error', 'Error Processing The Request. Please Try Again...');
          this.isSendingRequest.set(false);
        },
        complete: () => {
          this.triggerRefresh.set(true);
        }
      })
    ;

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
                this.messageService.createMessage('success', 'Food Item Added Successfully!')
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
          this.messageService.createMessage('error', 'Error Processing The Request. Please Try Again...');
          this.isSendingRequest.set(false);
        },
        complete: () => {
          this.isSendingRequest.set(false);
        }
      })

  }

}


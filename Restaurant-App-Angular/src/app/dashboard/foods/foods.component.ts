import {Component, effect, inject} from '@angular/core';
import {AddEmployeeComponent} from "../employees/add-employee/add-employee.component";
import {NzAvatarComponent} from "ng-zorro-antd/avatar";
import {NzIconDirective} from "ng-zorro-antd/icon";
import { NzTableModule, NzTableQueryParams } from "ng-zorro-antd/table";
import {NzModalService} from 'ng-zorro-antd/modal';
import {FoodBackendService} from './food-backend.service';
import {AddFoodComponent} from './add-food/add-food.component';

@Component({
  selector: 'app-foods',
  standalone: true,
  imports: [
    NzTableModule, NzAvatarComponent, NzIconDirective, AddEmployeeComponent, AddFoodComponent
  ],
  providers: [NzModalService],
  templateUrl: './foods.component.html',
  styleUrl: './foods.component.css'
})
export class FoodsComponent {
  protected backendService = inject(FoodBackendService);
  listOfFood = this.backendService.listOfFood;
  imageBaseUrl = 'https://restaurantapi.bssoln.com/images/food/'

  ngOnInit() {
    this.loadDataFromServer(this.pageIndex, this.backendService.totalFood());
  }

  pageSize = 10;
  pageIndex = 1;
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
    this.backendService.getListOFFood('', this.pageIndex.toString(), this.pageSize.toString(), '');
  }

  deleteFood(id: number) {
    this.backendService.deleteFood(id);
    if (this.backendService.listOfFood().length <= 1) {
      this.pageIndex = Math.max(1, this.pageIndex - 1);
    }
  }

  getImageUrl(imageUrl: string) {
    return this.imageBaseUrl + "/" + imageUrl;
  }

}

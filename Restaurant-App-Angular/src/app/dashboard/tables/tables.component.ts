import {Component, effect, inject} from '@angular/core';
import {AddFoodComponent} from "../foods/add-food/add-food.component";
import {NzAvatarComponent} from "ng-zorro-antd/avatar";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {
  NzTableCellDirective,
  NzTableComponent, NzTableQueryParams,
  NzTbodyComponent,
  NzThAddOnComponent, NzTheadComponent,
  NzThMeasureDirective, NzTrDirective
} from "ng-zorro-antd/table";
import {FoodBackendService} from '../foods/food-backend.service';
import {NzModalService} from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-tables',
  standalone: true,
    imports: [
        AddFoodComponent,
        NzAvatarComponent,
        NzIconDirective,
        NzTableCellDirective,
        NzTableComponent,
        NzTbodyComponent,
        NzThAddOnComponent,
        NzThMeasureDirective,
        NzTheadComponent,
        NzTrDirective
    ],
  providers: [NzModalService],
  templateUrl: './tables.component.html',
  styleUrl: './tables.component.css'
})
export class TablesComponent {
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

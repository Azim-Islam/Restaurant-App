import {Component, effect, inject} from '@angular/core';
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
import {TableBackendService} from './table-backend.service';
import {AvatarToolTipComponent} from './avatar-tool-tip/avatar-tool-tip.component';

@Component({
  selector: 'app-tables',
  standalone: true,
  imports: [
    NzAvatarComponent,
    NzIconDirective,
    NzTableCellDirective,
    NzTableComponent,
    NzTbodyComponent,
    NzThAddOnComponent,
    NzThMeasureDirective,
    NzTheadComponent,
    NzTrDirective,
    AvatarToolTipComponent
  ],
  providers: [NzModalService],
  templateUrl: './tables.component.html',
  styleUrl: './tables.component.css'
})
export class TablesComponent {
  protected backendService = inject(TableBackendService);
  listOfTable = this.backendService.listOfTable;
  listOfEmployees = this.backendService.listOfEmployees;
  imageBaseUrl = 'https://restaurantapi.bssoln.com/images/table/'


  ngOnInit() {
    this.loadDataFromServer(this.pageIndex, this.backendService.totalTable());
  }

  pageSize = 10;
  pageIndex = 1;
  constructor() {
    this.loadDataFromServer(this.pageIndex, this.backendService.totalTable());
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
    this.backendService.getListOfTables('', this.pageIndex.toString(), this.pageSize.toString(), '');
    this.backendService.loadFullListOfEmployee();
  }

  deleteFood(id: number) {
    this.backendService.deleteFood(id);
    if (this.backendService.listOfTable().length <= 1) {
      this.pageIndex = Math.max(1, this.pageIndex - 1);
    }
  }

  getImageUrl(imageUrl: string) {
    return this.imageBaseUrl + "/" + imageUrl;
  }

}

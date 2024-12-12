import {Component, effect, inject, Injector, ViewContainerRef} from '@angular/core';
import {NzAvatarComponent} from "ng-zorro-antd/avatar";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {
  NzTableCellDirective,
  NzTableComponent, NzTableQueryParams,
  NzTbodyComponent,
  NzThAddOnComponent, NzTheadComponent,
  NzThMeasureDirective, NzTrDirective
} from "ng-zorro-antd/table";
import {TableBackendService} from './table-backend.service';
import {AvatarToolTipComponent} from './avatar-tool-tip/avatar-tool-tip.component';
import {AddToTableComponent} from './add-to-table/add-to-table.component';
import {NzModalService} from 'ng-zorro-antd/modal';
import {toObservable} from '@angular/core/rxjs-interop';


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
    AvatarToolTipComponent,
    AddToTableComponent,
  ],
  providers: [NzModalService],
  templateUrl: './tables.component.html',
  styleUrl: './tables.component.css'
})
export class TablesComponent {
  protected backendService = inject(TableBackendService);
  modal = inject(NzModalService);
  viewContainerRef = inject(ViewContainerRef);
  listOfTable = this.backendService.listOfTable;
  listOfEmployees = this.backendService.listOfEmployees;
  imageBaseUrl = 'https://restaurantapi.bssoln.com/images/table/'
  private injector = inject(Injector);


  ngOnInit() {
    this.loadDataFromServer(this.pageIndex, this.backendService.totalTable());
  }

  pageSize = 10;
  pageIndex = 1;

  constructor() {
    this.backendService.isSendingRequest.set(true);
    effect(() => {
      if (this.backendService.triggerRefresh()) {
        this.ngOnInit();
        this.backendService.triggerRefresh.set(false);
      }
      if (!this.backendService.isLoadingTables() && !this.backendService.isLoadingEmployees()) {
        this.backendService.isSendingRequest.set(false);
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

  deleteTable(id: number) {
    this.backendService.deleteTable(id);
    if (this.backendService.listOfTable().length <= 1) {
      this.pageIndex = Math.max(1, this.pageIndex - 1);
    }
  }

  getImageUrl(imageUrl: string) {
    return this.imageBaseUrl + "/" + imageUrl;
  }

  showAssignModal(tableNumber: string, image: string, numberOfSeats: number) {
    this.backendService.assignTableNumber.set(tableNumber);
    this.backendService.assignTableImage.set(this.getImageUrl(image));
    this.backendService.assignTableSeats.set(numberOfSeats);
    this.backendService.showAssignModal.set(true);
  }

  protected readonly String = String;
}

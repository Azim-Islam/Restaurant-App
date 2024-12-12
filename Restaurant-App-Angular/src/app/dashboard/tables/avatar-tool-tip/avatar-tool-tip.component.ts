import {Component, inject, Injector, Input, input, InputSignal} from '@angular/core';
import {NzButtonComponent} from 'ng-zorro-antd/button';
import {NzTooltipDirective} from 'ng-zorro-antd/tooltip';
import {Employee, ResponseListOfEmployees} from '../../employees/employee.interface';
import {NzAvatarComponent} from 'ng-zorro-antd/avatar';
import {NzModalService} from 'ng-zorro-antd/modal';
// import {NzTransitionPatchDirective} from 'ng-zorro-antd/core/transition-patch/transition-patch.directive';
import {NzIconDirective} from 'ng-zorro-antd/icon';
import {NzContextMenuService, NzDropdownMenuComponent} from 'ng-zorro-antd/dropdown';
import {NzMenuDirective, NzMenuItemComponent, NzSubMenuComponent} from 'ng-zorro-antd/menu';
import {TableBackendService} from '../table-backend.service';
import {toObservable} from '@angular/core/rxjs-interop';


@Component({
  selector: 'app-avatar-tool-tip',
  standalone: true,
  imports: [
    NzButtonComponent,
    NzTooltipDirective,
    NzAvatarComponent,
    NzIconDirective,
    NzDropdownMenuComponent,
    NzMenuDirective,
    NzMenuItemComponent,
    NzSubMenuComponent,
  ],
  providers: [NzModalService],
  templateUrl: './avatar-tool-tip.component.html',
  styleUrl: './avatar-tool-tip.component.css',
})
export class AvatarToolTipComponent {
  modal = inject(NzModalService);
  employeeId: InputSignal<string> = input.required<string>();
  employeeName: InputSignal<string> = input.required<string>();
  employeeList: InputSignal<Employee[]> = input.required<Employee[]>();
  employeeImageUrl = '';
  nzContextMenuService = inject(NzContextMenuService);
  backendService = inject(TableBackendService);
  employeeTableId = input.required<string>() ;
  tableName = input.required<string>();
  private injector = inject(Injector);

  constructor() {

    toObservable(this.backendService.listOfEmployees, {
      injector: this.injector
    }).subscribe(
      value => {
        if (value){
          this.ngOnInit();
        }
      }
    )
  }

  ngOnInit(): void {
    this.employeeList().forEach((employee: Employee) => {
      if (employee.id === this.employeeId()){
        this.employeeImageUrl = `https://restaurantapi.bssoln.com/images/user/` + `/` + employee.user.image;
      }
    })
  }

  contextMenu($event: MouseEvent, menu: NzDropdownMenuComponent): void {
    this.nzContextMenuService.create($event, menu);
  }

  removeEmployeeFromTable(){
    this.backendService.removeEmployeeFromTable(this.employeeTableId());
  }

  showDeleteConfirm(): void {
    this.modal.confirm({
      nzTitle: `Remove "${this.employeeName()}" from ${this.tableName()}?`,
      nzOkText: 'Confirm Remove',
      nzOnOk: () => this.removeEmployeeFromTable(),
      nzCancelText: 'Cancel Operation',
      nzOnCancel: () => {}
    });
  }
}

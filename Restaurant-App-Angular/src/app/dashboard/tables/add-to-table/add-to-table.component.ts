import {AfterViewInit, Component, effect, ElementRef, inject, Injector, ViewChild} from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
} from "@angular/forms";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {NzColDirective, NzRowDirective} from "ng-zorro-antd/grid";
import {NzDatePickerComponent} from "ng-zorro-antd/date-picker";
import {NzFormControlComponent, NzFormDirective, NzFormItemComponent, NzFormLabelComponent} from "ng-zorro-antd/form";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {NzInputDirective, NzInputGroupComponent} from "ng-zorro-antd/input";
import {NzModalComponent, NzModalContentDirective, NzModalFooterDirective} from "ng-zorro-antd/modal";
import {NzOptionComponent, NzSelectComponent} from "ng-zorro-antd/select";
import {NzUploadComponent} from "ng-zorro-antd/upload";
import {TableBackendService} from '../table-backend.service';
import {
  NzAutocompleteComponent,
  NzAutocompleteOptionComponent,
  NzAutocompleteTriggerDirective
} from 'ng-zorro-antd/auto-complete';
import {Employee} from '../../employees/employee.interface';
import {NzAvatarComponent} from 'ng-zorro-antd/avatar';
import {toObservable} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-add-to-table',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NzButtonComponent,
    NzColDirective,
    NzDatePickerComponent,
    NzFormControlComponent,
    NzFormDirective,
    NzFormItemComponent,
    NzFormLabelComponent,
    NzIconDirective,
    NzInputDirective,
    NzModalComponent,
    NzOptionComponent,
    NzRowDirective,
    NzSelectComponent,
    NzUploadComponent,
    NzModalContentDirective,
    NzModalFooterDirective,
    NzInputGroupComponent,
    NzAutocompleteTriggerDirective,
    NzAutocompleteComponent,
    NzAutocompleteOptionComponent,
    NzAvatarComponent,
  ],
  templateUrl: './add-to-table.component.html',
  styleUrl: './add-to-table.component.css'
})
export class AddToTableComponent {
  backendService = inject(TableBackendService);
  modalWidth = "600px";
  inputValue?: string;
  listOfAvailableEmployees : Employee[] = this.backendService.listOfAvailableEmployees();
  private injector = inject(Injector);
  selectedEmployee = '';
  listOfSelectedEmployees : Employee[] = [];

  ngOnInit(): void {
  }
  checkAndStyleElement() {

  }

  constructor() {
    toObservable(this.backendService.showAssignModal, {
      injector: this.injector
    }).subscribe(
      value => {
        if (value){
          this.backendService.loadListOfAvailableEmployees(this.backendService.assignTableNumber());
        }
      }
    )

    toObservable(this.backendService.listOfAvailableEmployees, {
      injector: this.injector
    }).subscribe(
      value => {
        this.listOfAvailableEmployees = value;
      }
    )

    toObservable(this.backendService.assignTableNumber, {
      injector: this.injector
    }).subscribe(
      value => {
        // console.log(this.backendService.assignTableNumber(), value);
      }
    )

  }

  onChange(e: Event): void {
    const value = (e.target as HTMLInputElement).value;
    this.listOfAvailableEmployees = this.backendService.listOfAvailableEmployees().filter((emp) => {
      if ((emp.user.firstName.toLowerCase() +  emp.user.middleName.toLowerCase() + emp.user.lastName.toLowerCase()).includes(value.toLowerCase())) {
        return emp;
      }
      return;
    })
  }


  submitForm() {

  }

  handleCancel() {
    this.backendService.showAssignModal.set(false);
    this.inputValue = "";
    this.listOfSelectedEmployees = [];
  }

  handleOk() {
    if (this.listOfSelectedEmployees.length > 0) {
      this.backendService.assignEmployeeToTable(this.listOfSelectedEmployees, this.backendService.assignTableNumber());
      setTimeout(() => {
        this.backendService.triggerRefresh.set(false);
        this.handleCancel();
        this.backendService.triggerRefresh.set(true);
      }, 1000);
    }
    else{

    }
  }

  employeeSelected(id: string) {
    this.selectedEmployee = id;
    console.log(this.selectedEmployee);
  }

}

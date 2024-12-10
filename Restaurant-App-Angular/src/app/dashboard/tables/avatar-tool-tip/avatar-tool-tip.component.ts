import {Component, input, InputSignal} from '@angular/core';
import {NzButtonComponent} from 'ng-zorro-antd/button';
import {NzTooltipDirective} from 'ng-zorro-antd/tooltip';
import {Employee, ResponseListOfEmployees} from '../../employees/employee.interface';
import {NzAvatarComponent} from 'ng-zorro-antd/avatar';
import {NzModalService} from 'ng-zorro-antd/modal';
// import {NzTransitionPatchDirective} from 'ng-zorro-antd/core/transition-patch/transition-patch.directive';
import {NzIconDirective} from 'ng-zorro-antd/icon';


@Component({
  selector: 'app-avatar-tool-tip',
  standalone: true,
  imports: [
    NzButtonComponent,
    NzTooltipDirective,
    NzAvatarComponent,
    NzIconDirective,
  ],
  providers: [NzModalService],
  templateUrl: './avatar-tool-tip.component.html',
  styleUrl: './avatar-tool-tip.component.css',
})
export class AvatarToolTipComponent {
  employeeId: InputSignal<string> = input.required<string>();
  employeeName: InputSignal<string> = input.required<string>();
  employeeList: InputSignal<Employee[]> = input.required<Employee[]>();
  employeeImageUrl = '';

  ngOnInit(): void {
    this.employeeList().forEach((employee: Employee) => {
      if (employee.id === this.employeeId()){
        this.employeeImageUrl = `https://restaurantapi.bssoln.com/images/user/` + `/` + employee.user.image;
      }
    })
  }
}

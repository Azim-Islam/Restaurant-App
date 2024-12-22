import {Component, inject} from '@angular/core';
import {NzModalComponent, NzModalContentDirective, NzModalFooterDirective, NzModalService} from 'ng-zorro-antd/modal';
import {NzButtonComponent} from 'ng-zorro-antd/button';
import {AuthService} from '../../login/auth.service';
import {NzAvatarComponent} from 'ng-zorro-antd/avatar';
import {NzDropDownDirective} from 'ng-zorro-antd/dropdown';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    NzModalComponent,
    NzButtonComponent,
    NzModalFooterDirective,
    NzModalContentDirective,
    NzAvatarComponent,
    NzDropDownDirective
  ],
  providers: [NzModalService],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  authService = inject(AuthService);

  handleOk() {
    this.authService.showProfile.set(false);
  }

  getUserImage(image: string) {
    return 'https://restaurantapi.bssoln.com/images/user/' + '/' + image;
  }
}

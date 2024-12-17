import {Injectable} from '@angular/core';
import {NzMessageService} from 'ng-zorro-antd/message';
import {concatMap} from 'rxjs';

@Injectable({providedIn: 'root'})
export class MessageService {

  constructor(private message: NzMessageService) {

  }

  createMessage(type: string, messageContent: string): void {
    let config = {nzDuration: 2500, nzPauseOnHover: true, nzAnimate: true};
    switch (type) {
      case 'success':
        this.message.success(messageContent, config);
        break;
      case 'info':
        this.message.info(messageContent, config);
        break;
      case 'warning':
        this.message.warning(messageContent, config);
        break;
      case 'error':
        this.message.error(messageContent, config);
        break;
      case 'loading':
        this.message.loading(messageContent, config);
        break;
    }
  }

}

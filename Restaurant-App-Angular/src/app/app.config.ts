import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import {provideRouter, withComponentInputBinding} from '@angular/router';

import { routes } from './app.routes';
import {provideHttpClient} from '@angular/common/http';
import { en_US, provideNzI18n } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { FormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {provideNzIcons} from 'ng-zorro-antd/icon';

registerLocaleData(en);

import {IconDefinition} from '@ant-design/icons-angular';
import {
  AccountBookFill,
  AlertFill,
  AlertOutline,
  UserOutline,
  TeamOutline,
  MenuOutline,
  AndroidOutline,
  MenuFoldOutline,
  MenuUnfoldOutline,
  UsergroupAddOutline,
  IdcardOutline,
  GroupOutline,
  OrderedListOutline,
  PlusSquareOutline,
  PieChartOutline,
  PoweroffOutline,
  UserAddOutline,
  LoadingOutline,
} from '@ant-design/icons-angular/icons';

const icons: IconDefinition[] = [
  AccountBookFill,
  AlertOutline,
  AlertFill,
  UserOutline,
  TeamOutline,
  MenuOutline,
  AndroidOutline,
  MenuFoldOutline,
  MenuUnfoldOutline,
  UsergroupAddOutline,
  IdcardOutline,
  GroupOutline,
  OrderedListOutline,
  PlusSquareOutline,
  PieChartOutline,
  PoweroffOutline,
  UserAddOutline,
  LoadingOutline,

];

export const appConfig: ApplicationConfig = {
  providers:
    [
      provideNzIcons(icons),
      provideZoneChangeDetection({ eventCoalescing: true }),
      provideRouter(routes, withComponentInputBinding()),
      provideHttpClient(), provideNzI18n(en_US), importProvidersFrom(FormsModule), provideAnimationsAsync(), provideHttpClient(), provideAnimationsAsync(),
    ]
};

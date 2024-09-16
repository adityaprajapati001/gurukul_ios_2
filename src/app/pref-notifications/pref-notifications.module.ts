import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PrefNotificationsPageRoutingModule } from './pref-notifications-routing.module';

import { PrefNotificationsPage } from './pref-notifications.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PrefNotificationsPageRoutingModule
  ],
  declarations: [PrefNotificationsPage]
})
export class PrefNotificationsPageModule {}

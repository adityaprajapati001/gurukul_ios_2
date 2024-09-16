import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PrefMessagesPageRoutingModule } from './pref-messages-routing.module';

import { PrefMessagesPage } from './pref-messages.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PrefMessagesPageRoutingModule
  ],
  declarations: [PrefMessagesPage]
})
export class PrefMessagesPageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecentItemsPageRoutingModule } from './recent-items-routing.module';

import { RecentItemsPage } from './recent-items.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecentItemsPageRoutingModule
  ],
  declarations: []
})
export class RecentItemsPageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IndexActivitiesPageRoutingModule } from './index-activities-routing.module';

import { IndexActivitiesPage } from './index-activities.page';
import { NgxIonicImageViewerModule } from '@herdwatch-apps/ngx-ionic-image-viewer';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NgxIonicImageViewerModule,
    IndexActivitiesPageRoutingModule
  ],
  declarations: [IndexActivitiesPage]
})
export class IndexActivitiesPageModule {}

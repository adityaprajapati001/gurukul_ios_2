import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IndexActivityPageRoutingModule } from './index-activity-routing.module';

import { IndexActivityPage } from './index-activity.page';
import {NgxIonicImageViewerModule} from '@herdwatch-apps/ngx-ionic-image-viewer';
import { SafeHtmlPipe } from './safe.pipe';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { jspdf } from './jspdf.component';

import { TruncatePipe } from './truncate.pipe';


// @NgModule({
//   declarations: [
//     // other components and pipes
//     TruncatePipe
//   ],
//   // other configurations
// })
// export class AppModule { }




@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IndexActivityPageRoutingModule,
    ReactiveFormsModule,
    NgxIonicImageViewerModule,
    NgxDocViewerModule
  ],
  declarations: [IndexActivityPage, jspdf, SafeHtmlPipe, TruncatePipe],
})
export class IndexActivityPageModule {}

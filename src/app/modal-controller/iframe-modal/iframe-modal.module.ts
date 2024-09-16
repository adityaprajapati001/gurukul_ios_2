import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IframeModalPageRoutingModule } from './iframe-modal-routing.module';

import { IframeModalPage } from './iframe-modal.page';
import { IframeMessageListenerService } from 'src/app/services/iframe-message-listener/iframe-message-listener.service';
import { ScormApiService } from 'src/app/services/scorm-api/adityascorm-api.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IframeModalPageRoutingModule,
  ],
  declarations: [IframeModalPage],
  providers: [IframeMessageListenerService, ScormApiService],
})
export class IframeModalPageModule {}

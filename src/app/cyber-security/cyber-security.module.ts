import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CyberSecurityPageRoutingModule } from './cyber-security-routing.module';

import { CyberSecurityPage } from './cyber-security.page';
import { SharedModule } from '../shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { SafePipe } from './safe.pipe';
import { CustomLoadingComponent } from './custom-loading/custom-loading.component';
import { IframeMessageListenerService } from '../services/iframe-message-listener/iframe-message-listener.service';
import { ScormApiService } from '../services/scorm-api/adityascorm-api.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CyberSecurityPageRoutingModule,
    SharedModule,
    HttpClientModule
  ],
  declarations: [CyberSecurityPage, CustomLoadingComponent, SafePipe],
  
  providers: [IframeMessageListenerService, ScormApiService],

})
export class CyberSecurityPageModule {}

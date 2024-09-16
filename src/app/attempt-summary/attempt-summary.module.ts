import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AttemptSummaryPageRoutingModule } from './attempt-summary-routing.module';

import { AttemptSummaryPage } from './attempt-summary.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AttemptSummaryPageRoutingModule
  ],
  declarations: [AttemptSummaryPage]
})
export class AttemptSummaryPageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AccessibilityStatementPageRoutingModule } from './accessibility-statement-routing.module';

import { AccessibilityStatementPage } from './accessibility-statement.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AccessibilityStatementPageRoutingModule
  ],
  declarations: [AccessibilityStatementPage]
})
export class AccessibilityStatementPageModule {}

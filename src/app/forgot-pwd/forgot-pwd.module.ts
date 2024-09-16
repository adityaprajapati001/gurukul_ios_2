import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ForgotPwdPageRoutingModule } from './forgot-pwd-routing.module';

import { ForgotPwdPage } from './forgot-pwd.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ForgotPwdPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [ForgotPwdPage]
})
export class ForgotPwdPageModule {}

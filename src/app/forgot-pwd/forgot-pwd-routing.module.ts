import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ForgotPwdPage } from './forgot-pwd.page';

const routes: Routes = [
  {
    path: '',
    component: ForgotPwdPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ForgotPwdPageRoutingModule {}

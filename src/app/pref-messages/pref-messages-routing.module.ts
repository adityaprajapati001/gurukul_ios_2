import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PrefMessagesPage } from './pref-messages.page';

const routes: Routes = [
  {
    path: '',
    component: PrefMessagesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PrefMessagesPageRoutingModule {}

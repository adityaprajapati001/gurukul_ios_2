import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecentItemsPage } from './recent-items.page';

const routes: Routes = [
  {
    path: '',
    component: RecentItemsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecentItemsPageRoutingModule {}

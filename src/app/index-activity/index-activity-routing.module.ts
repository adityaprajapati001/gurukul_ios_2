import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IndexActivityPage } from './index-activity.page';

const routes: Routes = [
  {
    path: '',
    component: IndexActivityPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IndexActivityPageRoutingModule {}

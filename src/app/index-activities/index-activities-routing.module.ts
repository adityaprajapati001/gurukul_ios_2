import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IndexActivitiesPage } from './index-activities.page';

const routes: Routes = [
  {
    path: '',
    component: IndexActivitiesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IndexActivitiesPageRoutingModule {}

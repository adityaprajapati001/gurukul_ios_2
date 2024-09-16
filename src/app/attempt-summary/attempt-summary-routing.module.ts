import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AttemptSummaryPage } from './attempt-summary.page';

const routes: Routes = [
  {
    path: '',
    component: AttemptSummaryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AttemptSummaryPageRoutingModule {}

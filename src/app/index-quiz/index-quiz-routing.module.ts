import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IndexQuizPage } from './index-quiz.page';

const routes: Routes = [
  {
    path: '',
    component: IndexQuizPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IndexQuizPageRoutingModule {}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QuizContentUpdatePage } from './quiz-content-update.page';

const routes: Routes = [
  {
    path: '',
    component: QuizContentUpdatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuizContentUpdatePageRoutingModule {}

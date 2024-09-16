import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QuizContentPage } from './quiz-content.page';

const routes: Routes = [
  {
    path: '',
    component: QuizContentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuizContentPageRoutingModule {}

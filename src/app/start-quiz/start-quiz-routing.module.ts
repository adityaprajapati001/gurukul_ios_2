import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StartQuizPage } from './start-quiz.page';

const routes: Routes = [
  {
    path: '',
    component: StartQuizPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StartQuizPageRoutingModule {}

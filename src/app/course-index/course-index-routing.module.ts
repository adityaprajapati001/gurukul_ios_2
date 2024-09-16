import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CourseIndexPage } from './course-index.page';

const routes: Routes = [
  {
    path: '',
    component: CourseIndexPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CourseIndexPageRoutingModule {}

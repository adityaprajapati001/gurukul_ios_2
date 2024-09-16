import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CourseDownloadsPage } from './course-downloads.page';

const routes: Routes = [
  {
    path: '',
    component: CourseDownloadsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CourseDownloadsPageRoutingModule {}

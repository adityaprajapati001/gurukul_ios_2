import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CourseIndexPageRoutingModule } from './course-index-routing.module';

import { CourseIndexPage } from './course-index.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CourseIndexPageRoutingModule
  ],
  declarations: [CourseIndexPage]
})
export class CourseIndexPageModule {}

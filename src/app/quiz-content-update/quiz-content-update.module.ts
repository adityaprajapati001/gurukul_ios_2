import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { QuizContentUpdatePageRoutingModule } from './quiz-content-update-routing.module';

import { QuizContentUpdatePage } from './quiz-content-update.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    QuizContentUpdatePageRoutingModule
  ],
  declarations: [QuizContentUpdatePage]
})
export class QuizContentUpdatePageModule {}

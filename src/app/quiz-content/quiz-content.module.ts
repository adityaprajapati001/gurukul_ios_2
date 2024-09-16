import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { QuizContentPageRoutingModule } from './quiz-content-routing.module';

import { QuizContentPage } from './quiz-content.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    QuizContentPageRoutingModule
  ],
  declarations: [QuizContentPage]
})
export class QuizContentPageModule {}

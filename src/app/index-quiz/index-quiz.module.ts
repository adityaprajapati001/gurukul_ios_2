import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IndexQuizPageRoutingModule } from './index-quiz-routing.module';

import { IndexQuizPage } from './index-quiz.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IndexQuizPageRoutingModule
  ],
  declarations: [IndexQuizPage]
})
export class IndexQuizPageModule {}

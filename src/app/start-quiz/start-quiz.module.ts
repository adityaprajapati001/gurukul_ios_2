import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StartQuizPageRoutingModule } from './start-quiz-routing.module';

import { StartQuizPage } from './start-quiz.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StartQuizPageRoutingModule
  ],
  declarations: [StartQuizPage]
})
export class StartQuizPageModule {}

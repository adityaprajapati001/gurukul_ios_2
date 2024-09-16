import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FooterPage } from '../footer/footer.page';
import { HeaderPage } from '../header/header.page';
import { RecentItemsPage } from '../recent-items/recent-items.page';
import { ReplaceAmpPipe } from '../pipes/replace-amp/replace-amp.pipe';
import { SrcExtractorPipe } from '../pipes/src-extractor/src-extractor.pipe';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [FooterPage,HeaderPage,RecentItemsPage,ReplaceAmpPipe,SrcExtractorPipe],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule
  ],
  exports: [FooterPage,HeaderPage,RecentItemsPage,ReplaceAmpPipe,SrcExtractorPipe,ReactiveFormsModule]
})
export class SharedModule { }

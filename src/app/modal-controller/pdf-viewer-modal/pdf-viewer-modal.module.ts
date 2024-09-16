import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PdfViewerModalPageRoutingModule } from './pdf-viewer-modal-routing.module';

import { PdfViewerModalPage } from './pdf-viewer-modal.page';
import { SharedModule } from 'src/app/shared/shared.module';

import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PdfViewerModalPageRoutingModule,
    SharedModule,
    NgxExtendedPdfViewerModule
  ],
  declarations: [PdfViewerModalPage]
})
export class PdfViewerModalPageModule {}

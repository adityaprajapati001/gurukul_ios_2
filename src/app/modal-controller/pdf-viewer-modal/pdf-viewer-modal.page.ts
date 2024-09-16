import { Component, OnInit } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-pdf-viewer-modal',
  templateUrl: './pdf-viewer-modal.page.html',
  styleUrls: ['./pdf-viewer-modal.page.scss'],
})
export class PdfViewerModalPage implements OnInit {

  // pdfUrl: SafeResourceUrl | undefined;
  pdfUrl: any;
  
  constructor(
    private modalController: ModalController
  ) { }

  ngOnInit() {
  }

  dismiss() {
    this.modalController.dismiss();
  }

}

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PdfViewerModalPage } from './pdf-viewer-modal.page';

describe('PdfViewerModalPage', () => {
  let component: PdfViewerModalPage;
  let fixture: ComponentFixture<PdfViewerModalPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PdfViewerModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IframeModalPage } from './iframe-modal.page';

describe('IframeModalPage', () => {
  let component: IframeModalPage;
  let fixture: ComponentFixture<IframeModalPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(IframeModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

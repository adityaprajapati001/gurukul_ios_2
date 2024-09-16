import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IndexActivityPage } from './index-activity.page';

describe('IndexActivityPage', () => {
  let component: IndexActivityPage;
  let fixture: ComponentFixture<IndexActivityPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(IndexActivityPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

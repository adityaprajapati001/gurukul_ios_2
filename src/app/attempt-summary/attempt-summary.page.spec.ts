import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AttemptSummaryPage } from './attempt-summary.page';

describe('AttemptSummaryPage', () => {
  let component: AttemptSummaryPage;
  let fixture: ComponentFixture<AttemptSummaryPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AttemptSummaryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

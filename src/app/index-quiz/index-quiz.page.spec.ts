import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IndexQuizPage } from './index-quiz.page';

describe('IndexQuizPage', () => {
  let component: IndexQuizPage;
  let fixture: ComponentFixture<IndexQuizPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(IndexQuizPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

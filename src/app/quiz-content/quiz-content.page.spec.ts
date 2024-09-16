import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuizContentPage } from './quiz-content.page';

describe('QuizContentPage', () => {
  let component: QuizContentPage;
  let fixture: ComponentFixture<QuizContentPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(QuizContentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

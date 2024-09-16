import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuizContentUpdatePage } from './quiz-content-update.page';

describe('QuizContentUpdatePage', () => {
  let component: QuizContentUpdatePage;
  let fixture: ComponentFixture<QuizContentUpdatePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(QuizContentUpdatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

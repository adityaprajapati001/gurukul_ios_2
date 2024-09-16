import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StartQuizPage } from './start-quiz.page';

describe('StartQuizPage', () => {
  let component: StartQuizPage;
  let fixture: ComponentFixture<StartQuizPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(StartQuizPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

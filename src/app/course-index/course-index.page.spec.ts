import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CourseIndexPage } from './course-index.page';

describe('CourseIndexPage', () => {
  let component: CourseIndexPage;
  let fixture: ComponentFixture<CourseIndexPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CourseIndexPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

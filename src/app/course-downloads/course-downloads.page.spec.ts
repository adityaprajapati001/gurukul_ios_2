import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CourseDownloadsPage } from './course-downloads.page';

describe('CourseDownloadsPage', () => {
  let component: CourseDownloadsPage;
  let fixture: ComponentFixture<CourseDownloadsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CourseDownloadsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

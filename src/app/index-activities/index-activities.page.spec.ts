import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IndexActivitiesPage } from './index-activities.page';

describe('IndexActivitiesPage', () => {
  let component: IndexActivitiesPage;
  let fixture: ComponentFixture<IndexActivitiesPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(IndexActivitiesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

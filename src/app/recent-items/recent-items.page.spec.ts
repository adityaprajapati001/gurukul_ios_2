import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecentItemsPage } from './recent-items.page';

describe('RecentItemsPage', () => {
  let component: RecentItemsPage;
  let fixture: ComponentFixture<RecentItemsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(RecentItemsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PrefNotificationsPage } from './pref-notifications.page';

describe('PrefNotificationsPage', () => {
  let component: PrefNotificationsPage;
  let fixture: ComponentFixture<PrefNotificationsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PrefNotificationsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

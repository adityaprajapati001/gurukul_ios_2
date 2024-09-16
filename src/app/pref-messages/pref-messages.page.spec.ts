import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PrefMessagesPage } from './pref-messages.page';

describe('PrefMessagesPage', () => {
  let component: PrefMessagesPage;
  let fixture: ComponentFixture<PrefMessagesPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PrefMessagesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

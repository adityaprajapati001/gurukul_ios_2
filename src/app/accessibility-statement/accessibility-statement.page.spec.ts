import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccessibilityStatementPage } from './accessibility-statement.page';

describe('AccessibilityStatementPage', () => {
  let component: AccessibilityStatementPage;
  let fixture: ComponentFixture<AccessibilityStatementPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AccessibilityStatementPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

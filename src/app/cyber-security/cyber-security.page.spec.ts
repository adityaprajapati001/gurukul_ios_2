import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CyberSecurityPage } from './cyber-security.page';

describe('CyberSecurityPage', () => {
  let component: CyberSecurityPage;
  let fixture: ComponentFixture<CyberSecurityPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CyberSecurityPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LimpiezaFacialPage } from './limpieza-facial.page';

describe('LimpiezaFacialPage', () => {
  let component: LimpiezaFacialPage;
  let fixture: ComponentFixture<LimpiezaFacialPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LimpiezaFacialPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

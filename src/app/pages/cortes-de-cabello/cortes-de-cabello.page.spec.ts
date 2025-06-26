import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CortesDeCabelloPage } from './cortes-de-cabello.page';

describe('CortesDeCabelloPage', () => {
  let component: CortesDeCabelloPage;
  let fixture: ComponentFixture<CortesDeCabelloPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CortesDeCabelloPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

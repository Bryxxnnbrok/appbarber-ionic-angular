import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IaRecomendacionesPage } from './ia-recomendaciones.page';

describe('IaRecomendacionesPage', () => {
  let component: IaRecomendacionesPage;
  let fixture: ComponentFixture<IaRecomendacionesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(IaRecomendacionesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

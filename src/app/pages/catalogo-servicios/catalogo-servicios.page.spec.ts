import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CatalogoServiciosPage } from './catalogo-servicios.page';

describe('CatalogoServiciosPage', () => {
  let component: CatalogoServiciosPage;
  let fixture: ComponentFixture<CatalogoServiciosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CatalogoServiciosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

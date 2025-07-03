import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ArregloCejasPage } from './arreglo-cejas.page';

describe('ArregloCejasPage', () => {
  let component: ArregloCejasPage;
  let fixture: ComponentFixture<ArregloCejasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ArregloCejasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

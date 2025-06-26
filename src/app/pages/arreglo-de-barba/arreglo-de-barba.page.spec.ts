import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ArregloDeBarbaPage } from './arreglo-de-barba.page';

describe('ArregloDeBarbaPage', () => {
  let component: ArregloDeBarbaPage;
  let fixture: ComponentFixture<ArregloDeBarbaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ArregloDeBarbaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

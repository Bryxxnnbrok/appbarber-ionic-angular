import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectServicePage } from './select-service.page';

describe('SelectServicePage', () => {
  let component: SelectServicePage;
  let fixture: ComponentFixture<SelectServicePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectServicePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

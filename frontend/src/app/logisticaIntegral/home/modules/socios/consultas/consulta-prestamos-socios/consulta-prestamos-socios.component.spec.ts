import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaPrestamosSociosComponent } from './consulta-prestamos-socios.component';

describe('ConsultaPrestamosSociosComponent', () => {
  let component: ConsultaPrestamosSociosComponent;
  let fixture: ComponentFixture<ConsultaPrestamosSociosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultaPrestamosSociosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultaPrestamosSociosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

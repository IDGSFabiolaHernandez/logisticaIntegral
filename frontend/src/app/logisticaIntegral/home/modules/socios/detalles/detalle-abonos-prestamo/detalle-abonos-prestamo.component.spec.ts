import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleAbonosPrestamoComponent } from './detalle-abonos-prestamo.component';

describe('DetalleAbonosPrestamoComponent', () => {
  let component: DetalleAbonosPrestamoComponent;
  let fixture: ComponentFixture<DetalleAbonosPrestamoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetalleAbonosPrestamoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleAbonosPrestamoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

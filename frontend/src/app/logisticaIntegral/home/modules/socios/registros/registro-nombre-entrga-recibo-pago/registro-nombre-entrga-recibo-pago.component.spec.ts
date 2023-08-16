import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroNombreEntrgaReciboPagoComponent } from './registro-nombre-entrga-recibo-pago.component';

describe('RegistroNombreEntrgaReciboPagoComponent', () => {
  let component: RegistroNombreEntrgaReciboPagoComponent;
  let fixture: ComponentFixture<RegistroNombreEntrgaReciboPagoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistroNombreEntrgaReciboPagoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistroNombreEntrgaReciboPagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

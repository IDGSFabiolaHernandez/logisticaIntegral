import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleEnlaceSocioEmpresasComponent } from './detalle-enlace-socio-empresas.component';

describe('DetalleEnlaceSocioEmpresasComponent', () => {
  let component: DetalleEnlaceSocioEmpresasComponent;
  let fixture: ComponentFixture<DetalleEnlaceSocioEmpresasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetalleEnlaceSocioEmpresasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleEnlaceSocioEmpresasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

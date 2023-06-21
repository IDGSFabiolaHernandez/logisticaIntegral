import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificacionEnlaceSocioEmpresaComponent } from './modificacion-enlace-socio-empresa.component';

describe('ModificacionEnlaceSocioEmpresaComponent', () => {
  let component: ModificacionEnlaceSocioEmpresaComponent;
  let fixture: ComponentFixture<ModificacionEnlaceSocioEmpresaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModificacionEnlaceSocioEmpresaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModificacionEnlaceSocioEmpresaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

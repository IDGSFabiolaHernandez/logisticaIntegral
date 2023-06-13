import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificacionSocioComponent } from './modificacion-socio.component';

describe('ModificacionSocioComponent', () => {
  let component: ModificacionSocioComponent;
  let fixture: ComponentFixture<ModificacionSocioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModificacionSocioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModificacionSocioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

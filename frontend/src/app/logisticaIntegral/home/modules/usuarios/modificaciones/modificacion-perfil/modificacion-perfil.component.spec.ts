import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificacionPerfilComponent } from './modificacion-perfil.component';

describe('ModificacionPerfilComponent', () => {
  let component: ModificacionPerfilComponent;
  let fixture: ComponentFixture<ModificacionPerfilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModificacionPerfilComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModificacionPerfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroEnlaceSociosEmpresasComponent } from './registro-enlace-socio-empresa.component';

describe('RegistroEnlaceSociosEmpresasComponent', () => {
  let component: RegistroEnlaceSociosEmpresasComponent;
  let fixture: ComponentFixture<RegistroEnlaceSociosEmpresasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistroEnlaceSociosEmpresasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistroEnlaceSociosEmpresasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

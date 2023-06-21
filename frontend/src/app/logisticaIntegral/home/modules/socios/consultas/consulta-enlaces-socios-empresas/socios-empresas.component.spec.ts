import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SociosEmpresasComponent } from './socios-empresas.component';

describe('SociosEmpresasComponent', () => {
  let component: SociosEmpresasComponent;
  let fixture: ComponentFixture<SociosEmpresasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SociosEmpresasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SociosEmpresasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

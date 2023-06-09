import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaMensualidadesComponent } from './consulta-mensualidades.component';

describe('ConsultaMensualidadesComponent', () => {
  let component: ConsultaMensualidadesComponent;
  let fixture: ComponentFixture<ConsultaMensualidadesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultaMensualidadesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultaMensualidadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroPrestamoSocioComponent } from './registro-prestamo-socio.component';

describe('RegistroPrestamoSocioComponent', () => {
  let component: RegistroPrestamoSocioComponent;
  let fixture: ComponentFixture<RegistroPrestamoSocioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistroPrestamoSocioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistroPrestamoSocioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

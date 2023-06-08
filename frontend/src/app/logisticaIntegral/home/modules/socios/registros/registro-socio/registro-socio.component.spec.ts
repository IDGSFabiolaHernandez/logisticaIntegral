import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroSocioComponent } from './registro-socio.component';

describe('RegistroSocioComponent', () => {
  let component: RegistroSocioComponent;
  let fixture: ComponentFixture<RegistroSocioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistroSocioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistroSocioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

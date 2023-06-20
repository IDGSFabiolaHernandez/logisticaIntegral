import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroIntermediarioSociosComponent } from './registro-intermediario-socios.component';

describe('RegistroIntermediarioSociosComponent', () => {
  let component: RegistroIntermediarioSociosComponent;
  let fixture: ComponentFixture<RegistroIntermediarioSociosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistroIntermediarioSociosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistroIntermediarioSociosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

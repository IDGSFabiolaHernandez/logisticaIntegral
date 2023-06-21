import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistoEmpresaComponent } from './registo-empresa.component';

describe('RegistoEmpresaComponent', () => {
  let component: RegistoEmpresaComponent;
  let fixture: ComponentFixture<RegistoEmpresaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistoEmpresaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistoEmpresaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

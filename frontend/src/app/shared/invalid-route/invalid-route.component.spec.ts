import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvalidRouteComponent } from './invalid-route.component';

describe('InvalidRouteComponent', () => {
  let component: InvalidRouteComponent;
  let fixture: ComponentFixture<InvalidRouteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvalidRouteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvalidRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

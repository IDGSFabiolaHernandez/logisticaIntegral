import { TestBed } from '@angular/core/testing';

import { MensualidadesService } from './mensualidades.service';

describe('MensualidadesService', () => {
  let service: MensualidadesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MensualidadesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

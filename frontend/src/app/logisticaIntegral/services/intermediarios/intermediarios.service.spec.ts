import { TestBed } from '@angular/core/testing';

import { IntermediariosService } from './intermediarios.service';

describe('IntermediariosService', () => {
  let service: IntermediariosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IntermediariosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

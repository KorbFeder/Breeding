import { TestBed } from '@angular/core/testing';

import { BreedingService } from './breeding.service';

describe('BreedingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BreedingService = TestBed.get(BreedingService);
    expect(service).toBeTruthy();
  });
});

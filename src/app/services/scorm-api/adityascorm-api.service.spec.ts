import { TestBed } from '@angular/core/testing';

import { AdityascormApiService } from './adityascorm-api.service';

describe('AdityascormApiService', () => {
  let service: AdityascormApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdityascormApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

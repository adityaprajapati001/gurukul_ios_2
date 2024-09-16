import { TestBed } from '@angular/core/testing';

import { ScormApiService } from './scorm-api.service';

describe('ScormApiService', () => {
  let service: ScormApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScormApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

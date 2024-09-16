import { TestBed } from '@angular/core/testing';

import { IframeMessageListenerService } from './iframe-message-listener.service';

describe('IframeMessageListenerService', () => {
  let service: IframeMessageListenerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IframeMessageListenerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

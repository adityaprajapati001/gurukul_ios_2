import { TestBed } from '@angular/core/testing';

import { ChatContactService } from './chat-contact.service';

describe('ChatContactService', () => {
  let service: ChatContactService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatContactService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

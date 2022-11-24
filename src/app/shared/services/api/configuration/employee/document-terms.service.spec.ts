import { TestBed } from '@angular/core/testing';

import { DocumentTermsService } from './document-terms.service';

describe('DocumentTermsService', () => {
  let service: DocumentTermsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DocumentTermsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

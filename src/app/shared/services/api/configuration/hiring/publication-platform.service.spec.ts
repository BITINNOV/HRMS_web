import { TestBed } from '@angular/core/testing';

import { PublicationPlatformService } from './publication-platform.service';

describe('PublicationPlatformService', () => {
  let service: PublicationPlatformService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PublicationPlatformService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

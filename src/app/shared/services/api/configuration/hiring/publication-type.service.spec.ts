import {TestBed} from '@angular/core/testing';

import {PublicationTypeService} from './publication-type.service';

describe('PublicationTypeService', () => {
  let service: PublicationTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PublicationTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

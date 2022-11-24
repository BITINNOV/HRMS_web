import { TestBed } from '@angular/core/testing';

import { ActionTypeService } from './action-type.service';

describe('ActionTypeService', () => {
  let service: ActionTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActionTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

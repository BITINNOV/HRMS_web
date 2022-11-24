import {TestBed} from '@angular/core/testing';

import {SkillAreaService} from './skill-area.service';

describe('SkillAreaService', () => {
  let service: SkillAreaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SkillAreaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

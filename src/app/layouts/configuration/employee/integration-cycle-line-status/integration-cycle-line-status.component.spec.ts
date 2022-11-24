import {ComponentFixture, TestBed} from '@angular/core/testing';

import {IntegrationCycleLineStatusComponent} from './integration-cycle-line-status.component';

describe('IntegrationCycleLineStatusComponent', () => {
  let component: IntegrationCycleLineStatusComponent;
  let fixture: ComponentFixture<IntegrationCycleLineStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IntegrationCycleLineStatusComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IntegrationCycleLineStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

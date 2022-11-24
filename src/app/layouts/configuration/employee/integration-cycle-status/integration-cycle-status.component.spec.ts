import {ComponentFixture, TestBed} from '@angular/core/testing';

import {IntegrationCycleStatusComponent} from './integration-cycle-status.component';

describe('IntegrationCycleStatusComponent', () => {
  let component: IntegrationCycleStatusComponent;
  let fixture: ComponentFixture<IntegrationCycleStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IntegrationCycleStatusComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IntegrationCycleStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

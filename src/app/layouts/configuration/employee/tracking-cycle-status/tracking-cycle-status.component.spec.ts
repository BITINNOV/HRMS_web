import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TrackingCycleStatusComponent} from './tracking-cycle-status.component';

describe('TrackingCycleStatusComponent', () => {
  let component: TrackingCycleStatusComponent;
  let fixture: ComponentFixture<TrackingCycleStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TrackingCycleStatusComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackingCycleStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

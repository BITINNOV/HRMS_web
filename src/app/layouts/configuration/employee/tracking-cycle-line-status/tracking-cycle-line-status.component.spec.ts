import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TrackingCycleLineStatusComponent} from './tracking-cycle-line-status.component';

describe('TrackingCycleLineStatusComponent', () => {
  let component: TrackingCycleLineStatusComponent;
  let fixture: ComponentFixture<TrackingCycleLineStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TrackingCycleLineStatusComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackingCycleLineStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

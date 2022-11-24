import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HiringCycleComponent } from './hiring-cycle.component';

describe('HiringCycleComponent', () => {
  let component: HiringCycleComponent;
  let fixture: ComponentFixture<HiringCycleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HiringCycleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HiringCycleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

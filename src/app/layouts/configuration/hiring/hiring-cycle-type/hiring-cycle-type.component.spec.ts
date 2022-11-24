import {ComponentFixture, TestBed} from '@angular/core/testing';

import {HiringCycleTypeComponent} from './hiring-cycle-type.component';

describe('HiringCycleTypeComponent', () => {
  let component: HiringCycleTypeComponent;
  let fixture: ComponentFixture<HiringCycleTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HiringCycleTypeComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HiringCycleTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

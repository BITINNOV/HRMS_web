import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HiringPhaseComponent } from './hiring-phase.component';

describe('HiringPhaseComponent', () => {
  let component: HiringPhaseComponent;
  let fixture: ComponentFixture<HiringPhaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HiringPhaseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HiringPhaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

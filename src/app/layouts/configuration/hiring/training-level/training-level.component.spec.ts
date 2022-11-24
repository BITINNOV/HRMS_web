import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TrainingLevelComponent} from './training-level.component';

describe('TrainingLevelComponent', () => {
  let component: TrainingLevelComponent;
  let fixture: ComponentFixture<TrainingLevelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TrainingLevelComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainingLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

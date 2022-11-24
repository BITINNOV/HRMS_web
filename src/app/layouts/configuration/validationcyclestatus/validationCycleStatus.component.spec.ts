import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ValidationCycleStatusComponent} from './validationCycleStatus.component';

describe('ValidationcyclestatusComponent', () => {
  let component: ValidationCycleStatusComponent;
  let fixture: ComponentFixture<ValidationCycleStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ValidationCycleStatusComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidationCycleStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

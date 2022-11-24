import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ValidationCycleLineStatusComponent} from './validationCycleLineStatus.component';

describe('ValidationcyclelinestatusComponent', () => {
  let component: ValidationCycleLineStatusComponent;
  let fixture: ComponentFixture<ValidationCycleLineStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ValidationCycleLineStatusComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidationCycleLineStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

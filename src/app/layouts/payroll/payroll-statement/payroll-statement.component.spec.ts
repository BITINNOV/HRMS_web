import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrollStatementComponent } from './payroll-statement.component';

describe('PayrollStatementComponent', () => {
  let component: PayrollStatementComponent;
  let fixture: ComponentFixture<PayrollStatementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayrollStatementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PayrollStatementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrollBookComponent } from './payroll-book.component';

describe('PayrollBookComponent', () => {
  let component: PayrollBookComponent;
  let fixture: ComponentFixture<PayrollBookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayrollBookComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PayrollBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

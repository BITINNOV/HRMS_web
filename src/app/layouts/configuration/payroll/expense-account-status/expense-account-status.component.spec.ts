import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ExpenseAccountStatusComponent} from './expense-account-status.component';

describe('ExpenseAccountStatusComponent', () => {
  let component: ExpenseAccountStatusComponent;
  let fixture: ComponentFixture<ExpenseAccountStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExpenseAccountStatusComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpenseAccountStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

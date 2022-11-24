import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MutualInsuranceComponent } from './mutual-insurance.component';

describe('MutualInsuranceComponent', () => {
  let component: MutualInsuranceComponent;
  let fixture: ComponentFixture<MutualInsuranceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MutualInsuranceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MutualInsuranceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

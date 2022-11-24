import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VariableBonusComponent } from './variable-bonus.component';

describe('VariableBonusComponent', () => {
  let component: VariableBonusComponent;
  let fixture: ComponentFixture<VariableBonusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VariableBonusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VariableBonusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

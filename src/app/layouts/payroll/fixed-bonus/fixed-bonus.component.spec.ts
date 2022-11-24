import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FixedBonusComponent } from './fixed-bonus.component';

describe('FixedBonusComponent', () => {
  let component: FixedBonusComponent;
  let fixture: ComponentFixture<FixedBonusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FixedBonusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FixedBonusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

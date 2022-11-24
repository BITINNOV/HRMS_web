import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DisabilityNatureComponent} from './disability-nature.component';

describe('DisabilityNatureComponent', () => {
  let component: DisabilityNatureComponent;
  let fixture: ComponentFixture<DisabilityNatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DisabilityNatureComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DisabilityNatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

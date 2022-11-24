import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionTypeComponent } from './action-type.component';

describe('ActionTypeComponent', () => {
  let component: ActionTypeComponent;
  let fixture: ComponentFixture<ActionTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActionTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

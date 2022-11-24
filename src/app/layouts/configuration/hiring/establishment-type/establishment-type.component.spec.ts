import {ComponentFixture, TestBed} from '@angular/core/testing';

import {EstablishmentTypeComponent} from './establishment-type.component';

describe('EstablishmentTypeComponent', () => {
  let component: EstablishmentTypeComponent;
  let fixture: ComponentFixture<EstablishmentTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EstablishmentTypeComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EstablishmentTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

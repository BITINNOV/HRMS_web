import {ComponentFixture, TestBed} from '@angular/core/testing';

import {HiringTypeComponent} from './hiring-type.component';

describe('HiringTypeComponent', () => {
  let component: HiringTypeComponent;
  let fixture: ComponentFixture<HiringTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HiringTypeComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HiringTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
